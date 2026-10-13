import test from "node:test";
import assert from "node:assert/strict";
import { RateLimiter, escapeHtml, parseActivation, buildActivationEmail } from "./activation";
import { processStripeEvent, type Db } from "./stripe-events";
import { solidPng } from "./png";
import { defaultConfig } from "../config";
import { getCapabilities } from "../capabilities";

const validRequest = () => ({
  contact: { name: "Marie Dupont", email: "marie@boulangerie.fr", phone: "", message: "", consent: true, companyWebsite: "" },
  config: {
    ...defaultConfig(),
    identity: { ...defaultConfig().identity, businessName: "Boulangerie <b>Marie</b>" },
    program: { ...defaultConfig().program, rewardLabel: "Un café offert" },
  },
});

test("escapeHtml neutralise le HTML", () => {
  assert.equal(escapeHtml(`<script>"x"&'y'</script>`), "&lt;script&gt;&quot;x&quot;&amp;&#39;y&#39;&lt;/script&gt;");
});

test("l'e-mail d'activation échappe les saisies", () => {
  const parsed = parseActivation(validRequest());
  assert.equal(parsed.kind, "ok");
  if (parsed.kind === "ok") {
    const { html } = buildActivationEmail(parsed.data);
    assert.ok(!html.includes("<b>Marie</b>"));
    assert.ok(html.includes("&lt;b&gt;Marie"));
  }
});

test("honeypot rempli => détecté sans validation", () => {
  const req = validRequest();
  req.contact.companyWebsite = "http://spam";
  assert.equal(parseActivation(req).kind, "honeypot");
});

test("consentement absent ou e-mail invalide => refusé", () => {
  const noConsent = validRequest();
  (noConsent.contact as { consent: unknown }).consent = false;
  assert.equal(parseActivation(noConsent).kind, "invalid");
  const badMail = validRequest();
  badMail.contact.email = "pas-un-mail";
  assert.equal(parseActivation(badMail).kind, "invalid");
});

test("limiteur : la 6e demande dans la fenêtre est refusée, puis libérée", () => {
  const limiter = new RateLimiter(5, 1000);
  for (let i = 0; i < 5; i += 1) assert.ok(limiter.allow("ip", 0));
  assert.ok(!limiter.allow("ip", 500));
  assert.ok(limiter.allow("ip", 1500));
});

test("capacités : rien n'est actif sans variables", () => {
  assert.deepEqual(getCapabilities({}), { activationRequests: false, checkoutApi: false, walletSigning: false });
  assert.ok(getCapabilities({ RESEND_API_KEY: "k", LOYALTY_ACTIVATION_TO: "a@b.c", LOYALTY_ACTIVATION_FROM: "x@y.z" }).activationRequests);
});

test("PNG généré valide (signature + dimensions)", () => {
  const png = solidPng(29, "#ff8800");
  assert.equal(png.subarray(1, 4).toString("ascii"), "PNG");
  assert.equal(png.readUInt32BE(16), 29);
});

/** Faux Db en mémoire. */
function fakeDb() {
  const tables: Record<string, Record<string, unknown>[]> = { stripe_events: [], subscriptions: [], entitlements: [] };
  const db: Db = {
    from(table) {
      return {
        async insert(row) {
          if (table === "stripe_events" && tables[table].some((r) => r.id === row.id)) {
            return { error: { code: "23505", message: "duplicate" } };
          }
          tables[table].push(row);
          return { error: null };
        },
        async upsert(row, opts) {
          const key = opts?.onConflict ?? "id";
          const i = tables[table].findIndex((r) => r[key] === row[key]);
          if (i >= 0) tables[table][i] = { ...tables[table][i], ...row };
          else tables[table].push(row);
          return { error: null };
        },
        delete: () => ({
          async eq(col: string, val: string) {
            tables[table] = tables[table].filter((r) => r[col] !== val);
            return { error: null };
          },
        }),
      };
    },
  };
  return { db, tables };
}

const paidEvent = (id: string, paid = true) =>
  ({
    id,
    type: "checkout.session.completed",
    data: { object: { id: "cs_1", client_reference_id: "m-1", payment_status: paid ? "paid" : "unpaid", subscription: "sub_1", metadata: {} } },
  }) as never;

test("webhook : paiement confirmé => droit activé, rejeu idempotent", async () => {
  const { db, tables } = fakeDb();
  assert.equal(await processStripeEvent(db, paidEvent("evt_1")), "processed");
  assert.equal(tables.entitlements[0].loyalty_active, true);
  assert.equal(await processStripeEvent(db, paidEvent("evt_1")), "duplicate");
  assert.equal(tables.entitlements.length, 1);
  assert.equal(tables.subscriptions.length, 1);
});

test("webhook : session non payée => aucun droit", async () => {
  const { db, tables } = fakeDb();
  assert.equal(await processStripeEvent(db, paidEvent("evt_2", false)), "ignored");
  assert.equal(tables.entitlements.length, 0);
});

test("webhook : échec de traitement => l'événement peut être relivré", async () => {
  const { db, tables } = fakeDb();
  const failing: Db = {
    from(table) {
      const base = db.from(table);
      return table === "entitlements" ? { ...base, upsert: async () => ({ error: { message: "boom" } }) } : base;
    },
  };
  await assert.rejects(processStripeEvent(failing, paidEvent("evt_3")));
  assert.equal(tables.stripe_events.length, 0);
  assert.equal(await processStripeEvent(db, paidEvent("evt_3")), "processed");
});
