"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu } from "lucide-react";
import { Logo, SocialLinks } from "@/components/brand/Brand";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "@/lib/nav";

export function Header() {
  const pathname = usePathname();
  // Le menu est « ouvert pour un chemin donné » : il se referme tout seul à la navigation.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (value: boolean) => setOpenAt(value ? pathname : null);
  const [scrolled, setScrolled] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header className="v-header" data-scrolled={scrolled}>
        <div className="v-header-inner">
          <button
            ref={burgerRef}
            type="button"
            className="v-burger"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            aria-controls="v-mobile-nav"
            onClick={() => setOpen(true)}
          >
            <Menu size={24} aria-hidden />
          </button>

          <Link href="/" className="v-header-logo" aria-label="DamCompany — accueil">
            <Logo />
          </Link>

          <nav className="v-nav" aria-label="Navigation principale">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="v-nav-link"
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="v-header-actions">
            <SocialLinks />
            <Link href="/contact" className="v-btn v-btn-dark v-header-cta">
              Demander un devis <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </header>
      <MobileNav open={open} onClose={() => setOpen(false)} returnFocusRef={burgerRef} />
    </>
  );
}
