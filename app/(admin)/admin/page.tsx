import Link from "next/link";
import { Logo } from "@/components/brand/Brand";
import { requireAdmin } from "@/lib/admin/auth";

const MODULES = [
  { title: "Demandes de contact", text: "Leads reçus depuis le formulaire du site." },
  { title: "Clients & devis", text: "Fiches clients, devis et factures DamCompany." },
  { title: "Projets", text: "Suivi des projets, échéances et livrables." },
  { title: "Reporting", text: "Indicateurs et tableaux de bord de l'activité." },
];

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const user = await requireAdmin();
  return (
    <main className="v-admin-dash">
      <header>
        <Logo />
        <div>
          <span>{user.email}</span>
          <form action="/admin/logout" method="post">
            <button type="submit" className="v-btn v-btn-light">
              Se déconnecter
            </button>
          </form>
        </div>
      </header>

      <h1>Dashboard Business</h1>
      <p className="v-admin-note">
        Socle d&apos;administration du site damcompany.tech. Les modules ci-dessous accueilleront le dashboard business
        existant lors de sa migration.
      </p>

      <ul className="v-admin-grid">
        {MODULES.map((m) => (
          <li key={m.title}>
            <h2>{m.title}</h2>
            <p>{m.text}</p>
            <small>À migrer</small>
          </li>
        ))}
      </ul>
      <Link href="/" className="v-admin-back">
        ← Voir le site public
      </Link>
    </main>
  );
}
