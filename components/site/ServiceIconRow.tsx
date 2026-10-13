import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { OFFERS } from "@/content/offers";

export function ServiceIconRow() {
  return (
    <ul className="v-iconrow">
      {OFFERS.map((o) => (
        <li key={o.slug}>
          <Link href={`/services/${o.slug}`}>
            <Icon name={o.icon} size={30} />
            <span>{o.short}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Version mobile : 3 tuiles « Nos services » (maquette mobile). */
export function ServiceTiles() {
  const tiles = OFFERS.slice(0, 3);
  return (
    <ul className="v-tiles">
      {tiles.map((o) => (
        <li key={o.slug}>
          <Link href={`/services/${o.slug}`}>
            <Icon name={o.icon} size={26} />
            <span>{o.short.replace("Sites internet", "Site internet").replace("Applications mobiles", "Application mobile").replace("Intelligence artificielle", "IA")}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
