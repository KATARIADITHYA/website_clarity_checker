"use client";

import { useEffect, useRef } from "react";
import styles from "./MetricBar.module.css";

function barColor(s: number) {
  if (s >= 8) return "var(--teal)";
  if (s >= 6) return "var(--amber)";
  return "var(--red)";
}

export default function MetricBar({
  name,
  score,
  note,
}: {
  name: string;
  score: number;
  note: string;
}) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    el.style.width = "0%";
    const t = setTimeout(() => {
      el.style.width = `${(score / 10) * 100}%`;
    }, 80);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div className={styles.metric}>
      <div className={styles.metricHeader}>
        <span className={styles.metricName}>{name}</span>
        <span className={styles.metricScore} style={{ color: barColor(score) }}>
          {score}<span className={styles.metricDenom}>/10</span>
        </span>
      </div>
      <div className={styles.track}>
        <div
          ref={fillRef}
          className={styles.fill}
          style={{ background: barColor(score), transition: "width 0.8s cubic-bezier(.16,1,.3,1)" }}
        />
      </div>
      <div className={styles.metricNote}>{note}</div>
    </div>
  );
}
