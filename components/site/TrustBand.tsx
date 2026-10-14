import { MapPin } from "lucide-react";

const LOGOS = ["NZ 100%", "NOVRA", "ICP", "CMAKEUP BEAUTY", "DFC"];

export function TrustBand() {
  return (
    <div className="v-trust">
      <div className="v-trust-city">
        <MapPin size={20} aria-hidden />
        <span>Basé à Aulnay</span>
      </div>
      <div className="v-trust-clients">
        <span className="v-avatars" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span>+150 clients nous font confiance</span>
      </div>
      <ul className="v-trust-logos" aria-label="Ils nous font confiance">
        {LOGOS.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
