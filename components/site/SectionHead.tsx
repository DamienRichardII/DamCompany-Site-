import type { ReactNode } from "react";

export function SectionHead({
  number,
  title,
  sub,
  as: Tag = "h2",
  actions,
}: {
  number?: string;
  title: string;
  sub?: string;
  as?: "h1" | "h2";
  actions?: ReactNode;
}) {
  return (
    <div className="v-sechead">
      <div>
        {number && (
          <span className="v-num" aria-hidden>
            {number}
          </span>
        )}
        <Tag>{title}</Tag>
        {sub && <p>{sub}</p>}
      </div>
      {actions}
    </div>
  );
}
