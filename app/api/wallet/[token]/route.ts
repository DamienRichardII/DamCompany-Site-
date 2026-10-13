import { NextResponse } from "next/server";
import { getCapabilities } from "@/lib/loyalty/capabilities";
import { configSchema } from "@/lib/loyalty/config";
import { getAdminClient } from "@/lib/loyalty/server/supabase";
import { buildPass } from "@/lib/loyalty/server/wallet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Télécharge le pass Apple Wallet d'une carte RÉELLE, identifiée par son jeton
 * individuel imprévisible. Aucun pass factice : sans certificats, 503.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!getCapabilities().walletSigning) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  if (!/^[0-9a-f]{48}$/.test(token)) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const { data: card } = await admin
    .from("cards")
    .select("id, public_token, balance, members(first_name), programs(active, config)")
    .eq("public_token", token)
    .maybeSingle();

  const program = Array.isArray(card?.programs) ? card?.programs[0] : card?.programs;
  const member = Array.isArray(card?.members) ? card?.members[0] : card?.members;
  if (!card || !program?.active) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const config = configSchema.safeParse(program.config);
  if (!config.success) return NextResponse.json({ error: "invalid_program" }, { status: 500 });

  try {
    const buffer = buildPass({
      serial: card.id,
      publicToken: card.public_token,
      balance: card.balance,
      memberFirstName: member?.first_name ?? null,
      config: config.data,
    });
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": 'attachment; filename="carte-fidelite.pkpass"',
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[wallet] génération impossible", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "pass_failed" }, { status: 500 });
  }
}
