import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight, Bot, Play, Send } from "lucide-react";
import { Bolt } from "@/components/brand/Brand";
import type { VisualKey } from "@/content/offers";

/* -------------------------------------------------------------------------- */
/* Cadres d'appareils                                                          */
/* -------------------------------------------------------------------------- */

export function Laptop({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`vz-laptop ${className}`}>
      <div className="vz-laptop-screen">{children}</div>
      <div className="vz-laptop-base" />
    </div>
  );
}

export function Phone({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`vz-phone ${className}`}>
      <div className="vz-phone-screen">
        <span className="vz-phone-notch" />
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Écrans                                                                      */
/* -------------------------------------------------------------------------- */

export function SiteScreen() {
  return (
    <div className="vz-site">
      <div className="vz-site-nav">
        <b />
        <i />
        <i />
        <i />
        <u />
      </div>
      <div className="vz-site-hero">
        <small>Votre activité, sublimée</small>
        <h4>
          Un site à la hauteur
          <br />
          de votre marque
        </h4>
        <span className="vz-site-btn" />
      </div>
      <div className="vz-site-cards">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

export function AppScreen({ variant = "home" }: { variant?: "home" | "profiles" | "wallet" }) {
  if (variant === "wallet") {
    return (
      <div className="vz-app vz-app-wallet">
        <small>Wallet</small>
        <div className="vz-mini-card">
          <Bolt className="vz-mini-bolt" />
          <span>Client Premium</span>
        </div>
        <div className="vz-mini-card vz-mini-card-2" />
      </div>
    );
  }
  if (variant === "profiles") {
    return (
      <div className="vz-app">
        <div className="vz-app-top">
          <b>NOVRA</b>
          <i />
        </div>
        <div className="vz-app-grid">
          <i style={{ background: "linear-gradient(160deg,#d8b79b,#6d4a36)" }} />
          <i style={{ background: "linear-gradient(160deg,#9aa6b8,#2e3748)" }} />
          <i style={{ background: "linear-gradient(160deg,#f0d3b8,#a56f4d)" }} />
          <i style={{ background: "linear-gradient(160deg,#555,#161616)" }} />
        </div>
        <span className="vz-app-pill" />
      </div>
    );
  }
  return (
    <div className="vz-app">
      <div className="vz-app-top">
        <b>
          <Bolt className="vz-app-bolt" />
          DamC
        </b>
        <i />
      </div>
      <div className="vz-app-hero">
        <span>Bienvenue</span>
        <strong>Votre espace client</strong>
      </div>
      <div className="vz-app-list">
        <i />
        <i />
        <i />
      </div>
      <span className="vz-app-pill" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* QR + carte fidélité                                                         */
/* -------------------------------------------------------------------------- */

export function QrMock({ className = "" }: { className?: string }) {
  const n = 11;
  const cells: ReactNode[] = [];
  const finder = (x: number, y: number) => (x < 3 && y < 3) || (x > n - 4 && y < 3) || (x < 3 && y > n - 4);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const isFinder = finder(x, y);
      const isCenter = (x === 1 || x === n - 2) && (y === 1 || y === n - 2);
      const on = isFinder ? !isCenter : (x * 7 + y * 13 + x * y * 3) % 5 < 2;
      if (on) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" />);
    }
  }
  return (
    <svg className={className} viewBox={`0 0 ${n} ${n}`} fill="#0B0B0B" aria-hidden shapeRendering="crispEdges">
      {cells}
    </svg>
  );
}

export function LoyaltyCardMock({ className = "" }: { className?: string }) {
  return (
    <div className={`vz-lcard ${className}`}>
      <svg className="vz-lcard-lines" viewBox="0 0 300 190" fill="none" aria-hidden preserveAspectRatio="none">
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M-10 ${150 - i * 6} C 80 ${60 + i * 5}, 160 ${210 - i * 8}, 320 ${20 + i * 9}`}
            stroke="url(#dc-gold)"
            strokeWidth="0.8"
            opacity={0.35 + (i % 4) * 0.12}
          />
        ))}
        <defs>
          <linearGradient id="dc-gold" x1="0" x2="1">
            <stop offset="0" stopColor="#A9821A" />
            <stop offset="0.5" stopColor="#FEDD58" />
            <stop offset="1" stopColor="#A9821A" />
          </linearGradient>
        </defs>
      </svg>
      <span className="vz-lcard-logo">VOTRE LOGO</span>
      <div className="vz-lcard-qr">
        <QrMock />
      </div>
      <span className="vz-lcard-name">Client Premium</span>
      <Bolt className="vz-lcard-bolt" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reporting                                                                   */
/* -------------------------------------------------------------------------- */

export function ReportDash() {
  const bars = [38, 56, 44, 70, 52, 84, 62];
  return (
    <div className="vz-dash-wrap">
    <div className="vz-dash">
      <div className="vz-dash-head">
        <b />
        <i />
        <i />
      </div>
      <div className="vz-dash-kpis">
        <div>
          <small>Chiffre d&apos;affaires</small>
          <strong>12 458 €</strong>
          <em>+39%</em>
        </div>
        <div>
          <small>Nouveaux clients</small>
          <strong>248</strong>
          <em>+12%</em>
        </div>
      </div>
      <div className="vz-dash-row">
        <svg viewBox="0 0 200 80" className="vz-dash-area" aria-hidden preserveAspectRatio="none">
          <defs>
            <linearGradient id="dc-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FEDD58" stopOpacity="0.7" />
              <stop offset="1" stopColor="#FEDD58" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 62 C20 52 30 22 50 36 S80 58 100 32 S140 6 160 26 S190 16 200 10 L200 80 L0 80Z" fill="url(#dc-area)" />
          <path d="M0 62 C20 52 30 22 50 36 S80 58 100 32 S140 6 160 26 S190 16 200 10" fill="none" stroke="#0B0B0B" strokeWidth="1.6" />
        </svg>
        <div className="vz-dash-bars">
          {bars.map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="vz-dash-foot">
        <svg viewBox="0 0 40 40" className="vz-dash-donut" aria-hidden>
          <circle cx="20" cy="20" r="14" fill="none" stroke="#EFEAD9" strokeWidth="6" />
          <circle cx="20" cy="20" r="14" fill="none" stroke="#0B0B0B" strokeWidth="6" strokeDasharray="52 88" transform="rotate(-90 20 20)" />
          <circle cx="20" cy="20" r="14" fill="none" stroke="#FEDD58" strokeWidth="6" strokeDasharray="22 88" strokeDashoffset="-52" transform="rotate(-90 20 20)" />
        </svg>
        <div className="vz-dash-lines">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CRM 3D                                                                      */
/* -------------------------------------------------------------------------- */

export function CrmPanel() {
  return (
    <div className="vz-crm">
      <div className="vz-crm-stage">
        <div className="vz-crm-panel">
          <div className="vz-crm-side">
            <Bolt className="vz-crm-bolt" />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="vz-crm-main">
            <div className="vz-crm-top">
              <b />
              <span />
            </div>
            <div className="vz-crm-cols">
              {[0, 1, 2].map((c) => (
                <div key={c} className="vz-crm-col">
                  <small />
                  {Array.from({ length: c === 1 ? 3 : 2 }).map((_, i) => (
                    <div key={i} className="vz-crm-item">
                      <u />
                      <i />
                      <i />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="vz-crm-float">
          <u />
          <div>
            <i />
            <i />
          </div>
        </div>
      </div>
      <div className="vz-crm-pedestal" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* IA                                                                          */
/* -------------------------------------------------------------------------- */

export function AiCore() {
  const nodes = [
    [60, 70],
    [120, 40],
    [170, 85],
    [95, 130],
    [150, 150],
    [70, 190],
    [130, 205],
    [185, 180],
  ];
  return (
    <div className="vz-ai">
      <svg viewBox="0 0 260 260" className="vz-ai-orb" aria-hidden>
        <defs>
          <radialGradient id="dc-orb" cx="38%" cy="32%" r="75%">
            <stop offset="0" stopColor="#6a6a72" />
            <stop offset="0.35" stopColor="#25252a" />
            <stop offset="1" stopColor="#050506" />
          </radialGradient>
        </defs>
        <circle cx="130" cy="130" r="112" fill="url(#dc-orb)" />
        {[40, 75, 100].map((r) => (
          <ellipse key={r} cx="130" cy="130" rx={r} ry="112" fill="none" stroke="#FEDD58" strokeOpacity="0.28" strokeWidth="0.8" />
        ))}
        {[30, 65, 95].map((r) => (
          <ellipse key={r} cx="130" cy="130" rx="112" ry={r} fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="0.8" />
        ))}
        {nodes.map(([x, y], i) => {
          const [x2, y2] = nodes[(i + 3) % nodes.length];
          return <line key={`l${i}`} x1={x} y1={y} x2={x2} y2={y2} stroke="#FEDD58" strokeOpacity="0.5" strokeWidth="0.8" />;
        })}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.6" fill="#FEDD58" />
        ))}
      </svg>
      <div className="vz-ai-chat">
        <div className="vz-ai-bubble">
          <Bot size={14} aria-hidden />
          <span>Bonjour, comment puis-je vous aider ?</span>
        </div>
        <div className="vz-ai-input">
          <span>Tapez votre message…</span>
          <Send size={13} aria-hidden />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Motion design                                                               */
/* -------------------------------------------------------------------------- */

export function MotionFrame() {
  return (
    <div className="vz-motion">
      <div className="vz-motion-screen">
        <Bolt className="vz-motion-bolt" />
        <span className="vz-motion-play">
          <Play size={22} fill="currentColor" aria-hidden />
        </span>
        <p>
          VOTRE MARQUE
          <br />
          EN MOUVEMENT
        </p>
        <span className="vz-motion-bar">
          <i />
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Supports de création                                                        */
/* -------------------------------------------------------------------------- */

export function PrintTiles() {
  return (
    <div className="vz-print">
      <div className="vz-print-tile">
        <div className="vz-print-art vz-print-flyer">
          <small>FESTIVAL</small>
          <strong>SUMMER</strong>
          <em>12 · 07 · 2026</em>
        </div>
        <span>
          Flyer <ArrowUpRight size={14} aria-hidden />
        </span>
      </div>
      <div className="vz-print-tile">
        <div className="vz-print-art vz-print-cards">
          <div className="vz-bcard vz-bcard-a">
            <Bolt className="vz-bcard-bolt" />
          </div>
          <div className="vz-bcard vz-bcard-b">
            <small>VOTRE LOGO</small>
          </div>
        </div>
        <span>
          Carte de visite <ArrowUpRight size={14} aria-hidden />
        </span>
      </div>
      <div className="vz-print-tile">
        <div className="vz-print-art vz-print-loyalty">
          <LoyaltyCardMock />
        </div>
        <span>
          Carte fidélité <ArrowUpRight size={14} aria-hidden />
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Showroom (à propos)                                                         */
/* -------------------------------------------------------------------------- */

export function Showroom({ image }: { image?: string | null }) {
  if (image) {
    return (
      <div className="vz-showroom">
        <Image src={image} alt="L'espace DamCompany" fill sizes="(min-width: 900px) 520px, 100vw" style={{ objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div className="vz-showroom" role="img" aria-label="Showroom DamCompany">
      <div className="vz-showroom-wall">
        <Bolt className="vz-showroom-bolt" />
        <b>DamC</b>
      </div>
      <div className="vz-showroom-floor" />
      <div className="vz-showroom-desk" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Assemblages                                                                 */
/* -------------------------------------------------------------------------- */

export function DevicesDuo({ className = "" }: { className?: string }) {
  return (
    <div className={`vz-duo ${className}`}>
      <Laptop className="vz-duo-laptop">
        <SiteScreen />
      </Laptop>
      <Phone className="vz-duo-phone">
        <AppScreen />
      </Phone>
    </div>
  );
}

export function OfferVisual({ kind }: { kind: VisualKey }) {
  switch (kind) {
    case "web":
      return <DevicesDuo />;
    case "mobile":
      return (
        <div className="vz-phones">
          <Phone className="vz-phones-a">
            <AppScreen variant="profiles" />
          </Phone>
          <Phone className="vz-phones-b">
            <AppScreen variant="home" />
          </Phone>
        </div>
      );
    case "ai":
      return <AiCore />;
    case "crm":
      return <CrmPanel />;
    case "report":
      return <ReportDash />;
    case "motion":
      return <MotionFrame />;
    case "loyalty":
      return (
        <div className="vz-loyalty">
          <Phone className="vz-loyalty-phone">
            <AppScreen variant="wallet" />
          </Phone>
          <LoyaltyCardMock className="vz-loyalty-card" />
        </div>
      );
    case "print":
      return <PrintTiles />;
  }
}
