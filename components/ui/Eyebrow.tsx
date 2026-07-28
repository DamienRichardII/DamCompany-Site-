import styles from "./Eyebrow.module.css";

export function Eyebrow({ children }: { children: string }) {
  return <span className={styles.eyebrow}>{children}</span>;
}
