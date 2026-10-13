import { SITE } from "@/lib/site";

/** Éclair DamCompany. */
export function Bolt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 160" aria-hidden focusable="false">
      <defs>
        <linearGradient id="dc-bolt-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF08A" />
          <stop offset="0.55" stopColor="#FEDD58" />
          <stop offset="1" stopColor="#E9B923" />
        </linearGradient>
      </defs>
      <path d="M64 0 L6 94 L44 94 L24 160 L98 60 L58 60 L84 0 Z" fill="url(#dc-bolt-g)" />
    </svg>
  );
}

/** Logo horizontal (header / footer). */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`v-logo ${className}`}>
      <Bolt className="v-logo-bolt" />
      <span className="v-logo-text">{SITE.name}</span>
    </span>
  );
}

/** Grand logo « DamC » du hero. */
export function BigMark({ className = "" }: { className?: string }) {
  return (
    <div className={`v-bigmark ${className}`} role="img" aria-label="DamCompany">
      <Bolt className="v-bigmark-bolt" />
      <span className="v-bigmark-text" aria-hidden>
        DamC
      </span>
    </div>
  );
}

export function TikTokIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.6 2h-3.1v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .8.1V9.4a6 6 0 1 0 5.2 5.9V8.6a7.3 7.3 0 0 0 4.2 1.3V6.8a4.3 4.3 0 0 1-4.2-4.8z" />
    </svg>
  );
}

export function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SocialLinks({ className = "", size = 22 }: { className?: string; size?: number }) {
  return (
    <span className={`v-social ${className}`}>
      <a href={SITE.socials.tiktok} target="_blank" rel="noopener noreferrer" aria-label="DamCompany sur TikTok">
        <TikTokIcon size={size} />
      </a>
      <a href={SITE.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="DamCompany sur Instagram">
        <InstagramIcon size={size} />
      </a>
    </span>
  );
}
