"use client";

import { useEffect, useRef } from "react";

const CIRC = 339.29; // 2 * π * 54

function scoreColor(s: number) {
  if (s >= 8) return "var(--teal)";
  if (s >= 6) return "var(--amber)";
  return "var(--red)";
}

export default function ScoreRing({ score }: { score: number }) {
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    ring.style.strokeDasharray = String(CIRC);
    ring.style.strokeDashoffset = String(CIRC);
    ring.style.stroke = scoreColor(score);
    const t = setTimeout(() => {
      ring.style.strokeDashoffset = String(CIRC - (score / 10) * CIRC);
    }, 80);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ overflow: "visible" }}>
      <circle
        cx="60" cy="60" r="54"
        fill="none"
        stroke="var(--border)"
        strokeWidth="5"
      />
      <circle
        ref={ringRef}
        cx="60" cy="60" r="54"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        style={{
          transformOrigin: "60px 60px",
          transform: "rotate(-90deg)",
          transition: "stroke-dashoffset 1s cubic-bezier(.16,1,.3,1), stroke .4s",
        }}
      />
    </svg>
  );
}
