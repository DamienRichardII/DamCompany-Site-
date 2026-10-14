"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Bolt } from "@/components/brand/Brand";

export type TeamMember = { name: string; role: string; image: string | null };

export function TeamCarousel({ members }: { members: TeamMember[] }) {
  const scrollable = members.length > 3;
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="v-team" data-count={members.length}>
      {scrollable && (
        <button
          type="button"
          className="v-team-arrow v-team-prev"
          aria-label="Membre précédent"
          onClick={() => scroll(-1)}
        >
          <ChevronLeft size={20} aria-hidden />
        </button>
      )}
      <ul ref={track} className="v-team-track">
        {members.map((m, i) => (
          <li key={m.name} className="v-member">
            <div className="v-member-photo" data-tone={i % 3}>
              {m.image ? (
                <Image
                  src={m.image}
                  alt={`${m.name}, ${m.role}`}
                  fill
                  sizes="(min-width: 900px) 340px, 80vw"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <>
                  <svg viewBox="0 0 200 200" aria-hidden fill="currentColor">
                    <circle cx="100" cy="68" r="38" />
                    <path d="M20 200c0-46 36-74 80-74s80 28 80 74z" />
                  </svg>
                  <Bolt className="v-member-bolt" />
                </>
              )}
            </div>
            <p className="v-member-name">{m.name}</p>
            <p className="v-member-role">{m.role}</p>
          </li>
        ))}
      </ul>
      {scrollable && (
        <button
          type="button"
          className="v-team-arrow v-team-next"
          aria-label="Membre suivant"
          onClick={() => scroll(1)}
        >
          <ChevronRight size={20} aria-hidden />
        </button>
      )}
    </div>
  );
}
