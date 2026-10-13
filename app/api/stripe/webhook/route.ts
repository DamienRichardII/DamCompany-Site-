import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCapabilities } from "@/lib/loyalty/capabilities";
import { getAdminClient } from "@/lib/loyalty/server/supabase";
import { processStripeEvent } from "@/lib/loyalty/server/stripe-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook Stripe : SEULE source de vérité pour l'activation payée.
 * La page de succès du Checkout ne suffit jamais à activer un programme.
 */
export async function POST(request: Request) {
  if (!getCapabilities().checkoutApi) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "missing_signature" }, { status: 400 });

  const payload = await request.text(); // corps brut requis pour la vérification
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  try {
    const result = await processStripeEvent(admin, event);
    return NextResponse.json({ received: true, duplicate: result === "duplicate" });
  } catch (error) {
    console.error("[stripe/webhook] échec", event.id, error instanceof Error ? error.message : error);
    // 500 => Stripe réessaie ; l'idempotence évite tout double effet.
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }
}
