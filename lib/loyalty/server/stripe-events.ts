import type Stripe from "stripe";

/** Sous-ensemble de l'API Supabase utilisé ici (facilite les tests sans réseau). */
export type Db = {
  from(table: string): {
    insert(row: Record<string, unknown>): PromiseLike<{ error: { code?: string; message: string } | null }>;
    upsert(row: Record<string, unknown>, opts?: { onConflict?: string }): PromiseLike<{ error: { message: string } | null }>;
    delete(): { eq(col: string, val: string): PromiseLike<{ error: { message: string } | null }> };
  };
};

const DUPLICATE_KEY = "23505";

/**
 * Traite un événement Stripe déjà authentifié (signature vérifiée par l'appelant).
 * Idempotent : l'identifiant d'événement est inscrit en premier ; un doublon est ignoré.
 * Si le traitement échoue, l'inscription est retirée pour permettre la relivraison.
 */
export async function processStripeEvent(db: Db, event: Pick<Stripe.Event, "id" | "type" | "data">): Promise<"processed" | "duplicate" | "ignored"> {
  const claim = await db.from("stripe_events").insert({ id: event.id, type: event.type });
  if (claim.error) {
    if (claim.error.code === DUPLICATE_KEY) return "duplicate";
    throw new Error(claim.error.message);
  }

  try {
    const outcome = await apply(db, event);
    return outcome;
  } catch (error) {
    await db.from("stripe_events").delete().eq("id", event.id);
    throw error;
  }
}

async function apply(db: Db, event: Pick<Stripe.Event, "type" | "data">): Promise<"processed" | "ignored"> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const merchantId = session.client_reference_id ?? session.metadata?.merchant_id;
      // Paiement réellement encaissé uniquement.
      if (!merchantId || session.payment_status !== "paid") return "ignored";
      await mustOk(
        db.from("subscriptions").upsert(
          {
            merchant_id: merchantId,
            stripe_checkout_session_id: session.id,
            stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
            status: "active",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "stripe_checkout_session_id" }
        )
      );
      await mustOk(
        db.from("entitlements").upsert(
          { merchant_id: merchantId, loyalty_active: true, updated_at: new Date().toISOString() },
          { onConflict: "merchant_id" }
        )
      );
      return "processed";
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const merchantId = subscription.metadata?.merchant_id;
      if (!merchantId) return "ignored";
      await mustOk(
        db.from("entitlements").upsert(
          { merchant_id: merchantId, loyalty_active: false, updated_at: new Date().toISOString() },
          { onConflict: "merchant_id" }
        )
      );
      return "processed";
    }
    default:
      return "ignored";
  }
}

async function mustOk(op: PromiseLike<{ error: { message: string } | null }>) {
  const { error } = await op;
  if (error) throw new Error(error.message);
}
