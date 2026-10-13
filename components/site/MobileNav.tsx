"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import { ArrowRight, X } from "lucide-react";
import { Logo, SocialLinks } from "@/components/brand/Brand";
import { NAV_ITEMS, SERVICE_LINKS } from "@/lib/nav";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNav({
  open,
  onClose,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const returnEl = returnFocusRef.current;
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      returnEl?.focus();
    };
  }, [open, onClose, returnFocusRef]);

  return (
    <div
      id="v-mobile-nav"
      ref={panel}
      className="v-mnav"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
    >
      <div className="v-mnav-top">
        <Logo />
        <button ref={closeBtn} type="button" className="v-burger" aria-label="Fermer le menu" onClick={onClose}>
          <X size={24} aria-hidden />
        </button>
      </div>

      <nav className="v-mnav-links" aria-label="Menu mobile">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose}>
            {item.label}
          </Link>
        ))}
      </nav>

      <p className="v-mnav-label">Nos services</p>
      <div className="v-mnav-services">
        {SERVICE_LINKS.map((s) => (
          <Link key={s.href} href={s.href} onClick={onClose}>
            {s.label}
          </Link>
        ))}
      </div>

      <div className="v-mnav-foot">
        <Link href="/contact" className="v-btn v-btn-dark" onClick={onClose}>
          Demander un devis <ArrowRight size={16} aria-hidden />
        </Link>
        <SocialLinks size={24} />
      </div>
    </div>
  );
}
