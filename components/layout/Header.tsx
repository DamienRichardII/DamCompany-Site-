"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "@/lib/nav";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled}>
        <div className={`dc-container ${styles.inner}`}>
          <Link href="/" className={styles.logoLink} aria-label="DamCompany — accueil">
            <Image src="/brand/logo.svg" alt="" width={34} height={34} className={styles.logo} priority />
          </Link>

          <nav className={styles.desktopNav} aria-label="Navigation principale">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <button
              ref={burgerRef}
              type="button"
              className={styles.burger}
              aria-expanded={menuOpen}
              aria-controls="dc-mobile-nav"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className={styles.burgerBar} />
              <span className={styles.burgerBar} />
              <span className={styles.burgerBar} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        returnFocusRef={burgerRef}
      />
    </>
  );
}
