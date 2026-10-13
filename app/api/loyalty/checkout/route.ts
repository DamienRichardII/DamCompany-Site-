import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCapabilities } from "@/lib/loyalty/capabilities";
import { getAdminClient, getUserClient } from "@/lib/loyalty/server/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Crée une session Stripe Checkout pour le commerçant AUTHENTIFIÉ.
 * Le prix vient de STRIPE_LOYALTY_PRICE_ID (jamais du client). L'activation
 * réelle n'a lieu que via le webhook signé.
 */
export async function POST(request: Request) {
  if (!getCapabilities().checkoutApi) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const userClient = getUserClient(token);
  const admin = getAdminClient();
  if (!userClient || !admin) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const { data: userData, error: userError } = await userClient.auth.getUser(token);
  if (userError || !userData.user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  // RLS : le commerçant ne retrouve que sa propre fiche.
  const { data: merchant } = await userClient.from("merchants").select("id, stripe_customer_id").maybeSingle();
  if (!merchant) return NextResponse.json({ error: "no_merchant" }, { status: 403 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const mode = process.env.STRIPE_LOYALTY_MODE === "payment" ? "payment" : "subscription";

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: process.env.STRIPE_LOYALTY_PRICE_ID!, quantity: 1 }],
      client_reference_id: merchant.id,
      ...(merchant.stripe_customer_id ? { customer: merchant.stripe_customer_id } : { customer_email: userData.user.email ?? undefined }),
      metadata: { merchant_id: merchant.id },
      ...(mode === "subscription" ? { subscription_data: { metadata: { merchant_id: merchant.id } } } : {}),
      success_url: `${siteUrl}/carte-de-fidelite?activation=retour`,
      cancel_url: `${siteUrl}/carte-de-fidelite?activation=annule`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[loyalty/checkout]", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "checkout_failed" }, { status: 502 });
  }
}
