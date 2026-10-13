import {
  Bell,
  Bot,
  Box,
  ChartColumn,
  Clapperboard,
  CreditCard,
  Globe,
  Layers,
  Monitor,
  Palette,
  Search,
  Smartphone,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/content/offers";

const MAP = {
  web: Globe,
  mobile: Smartphone,
  ai: Bot,
  crm: Box,
  report: ChartColumn,
  motion: Clapperboard,
  loyalty: CreditCard,
  print: Layers,
  design: Palette,
  responsive: Monitor,
  seo: Search,
  payment: CreditCard,
  notification: Bell,
} as const;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = MAP[name];
  return <Cmp strokeWidth={1.6} aria-hidden {...props} />;
}

/** Puce « cercle + coche » des listes de la maquette. */
export function CheckDot({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.8 8.2l2.2 2.2 4.2-4.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
