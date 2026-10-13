import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Configurator } from "@/components/loyalty/Configurator";
import { LoyaltyCard } from "@/components/loyalty/LoyaltyCard";
import { getCapabilities } from "@/lib/loyalty/capabilities";
import { LOYALTY_PRICING } from "@/lib/loyalty/pricing";
import { defaultConfig, toPreviewModel } from "@/lib/loyalty/config";
import styles from "./page.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Carte de fidélité digitale",
  description:
    "Créez gratuitement une carte de fidélité digitale à l'image de votre commerce : logo, couleurs, programme. Prévisualisez-la en direct avant d'activer.",
  path: "/carte-de-fidelite",
});

// Les capacités dépendent de l'environnement serveur : lecture à chaque requête.
export const dynamic = "force-dynamic";

const STEPS = [
  {
    n: "01",
    title: "Personnalisez",
    text: "Logo, couleurs, modèle et programme de récompense. L'aperçu se met à jour en direct, sans compte et sans frais.",
  },
  {
    n: "02",
    title: "Activez",
    text: "Quand la carte vous plaît, vous demandez l'activation. Elle ouvre votre lien d'inscription et votre QR code public.",
  },
  {
    n: "03",
    title: "Partagez",
    text: "Vos clients scannent le QR code en boutique, rejoignent gratuitement et reçoivent leur carte individuelle.",
  },
];

const BENEFITS = [
  {
    title: "Une carte à portée de main",
    text: "Plus de carte papier égarée : le client retrouve sa carte sur son téléphone, quand il en a besoin.",
  },
  {
    title: "Des récompenses lisibles",
    text: "Progression et récompense visibles d'un coup d'œil, pour donner envie de revenir.",
  },
  {
    title: "L'identité de votre commerce",
    text: "Votre logo, vos couleurs, votre ton. La carte ressemble à votre enseigne, pas à un modèle générique.",
  },
];

const FAQ = [
  {
    q: "Combien ça coûte ?",
    a: "Personnaliser et prévisualiser votre carte est gratuit. Les conditions d'activation ne sont pas encore publiées : aucun tarif n'est affiché tant qu'il n'est pas arrêté. Vos clients, eux, rejoignent toujours gratuitement.",
  },
  {
    q: "La carte Apple Wallet sera-t-elle identique à l'aperçu web ?",
    a: "Non, pas à l'identique. Apple impose un gabarit pour les cartes Wallet : disposition, polices et position des éléments ne sont pas libres. Nous reprenons votre nom, vos couleurs et votre logo dans ce cadre. L'aperçu Wallet du configurateur est approximatif.",
  },
  {
    q: "Quelle différence entre le QR code du commerce et celui du client ?",
    a: "Le QR code public du commerce sert à rejoindre le programme. Le QR code individuel est propre à chaque adhérent : il permet au commerçant de retrouver sa carte. Ce sont deux codes distincts.",
  },
  {
    q: "Un client peut-il se créditer des points en scannant un QR code ?",
    a: "Non. Scanner un QR code ne crédite jamais une carte. Seul un commerçant authentifié et autorisé peut ajouter un passage ou valider une récompense.",
  },
  {
    q: "Mes données sont-elles enregistrées pendant la personnalisation ?",
    a: "Votre configuration est conservée uniquement dans votre navigateur, sous forme de brouillon. Rien n'est envoyé à nos serveurs tant que vous n'envoyez pas de demande d'activation. Le brouillon ne contient aucune donnée d'adhérent.",
  },
  {
    q: "Quand pourrai-je activer ma carte ?",
    a: "Selon l'ouverture des services. Si l'activation en ligne n'est pas encore disponible, le configurateur l'indique clairement et conserve votre carte dans ce navigateur.",
  },
];

export default function LoyaltyPage() {
  const capabilities = getCapabilities();
  const example = toPreviewModel(defaultConfig("elegant"));

  return (
    <main id="main" className={styles.page}>
      <section className={styles.hero} aria-labelledby="loyalty-title">
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Carte de fidélité</p>
          <h1 id="loyalty-title" className={styles.title}>
            Votre marque. Leur fidélité.
          </h1>
          <p className={styles.lead}>Créez une carte de fidélité digitale à votre image.</p>
          <a href="#configurateur" className={styles.cta}>
            Créer ma carte
          </a>
        </div>
        <div className={styles.heroCard}>
          <LoyaltyCard model={example} />
          <p className={styles.caption}>Exemple</p>
        </div>
      </section>

      <section id="configurateur" className={styles.configurator} aria-labelledby="configurator-title">
        <h2 id="configurator-title" className={styles.sectionTitle}>
          Composez votre carte
        </h2>
        <Configurator activationEnabled={capabilities.activationRequests} pricing={LOYALTY_PRICING} />
      </section>

      <section className={styles.section} aria-labelledby="how-title">
        <h2 id="how-title" className={styles.sectionTitle}>
          Trois étapes
        </h2>
        <ol className={styles.steps}>
          {STEPS.map((step) => (
            <li key={step.n} className={styles.step}>
              <span className={styles.stepNum}>{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="benefits-title">
        <h2 id="benefits-title" className={styles.sectionTitle}>
          Pourquoi une carte digitale
        </h2>
        <ul className={styles.benefits}>
          {BENEFITS.map((benefit) => (
            <li key={benefit.title} className={styles.benefit}>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="faq-title">
        <h2 id="faq-title" className={styles.sectionTitle}>
          Questions fréquentes
        </h2>
        <div className={styles.faq}>
          {FAQ.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
