"use client";

import { useEffect, useState } from "react";

const BUBBLE_PAUSE_MS = 900;
const START_DELAY_MS = 400;

export default function PitchBubbles({ lines }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    let cancelled = false;
    const timeouts = [];

    function reveal(i) {
      if (cancelled || i > lines.length) return;
      setVisibleCount(i);
      if (i < lines.length) {
        const t = setTimeout(() => reveal(i + 1), BUBBLE_PAUSE_MS);
        timeouts.push(t);
      }
    }

    const startTimeout = setTimeout(() => reveal(1), START_DELAY_MS);
    timeouts.push(startTimeout);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [lines]);

  return (
    <div className="pitch-bubbles" aria-hidden="true">
      {lines.slice(0, visibleCount).map((line, i) => (
        <div className="pitch-bubble" key={i}>
          <span className="pitch-bubble-text">{line}</span>
        </div>
      ))}
    </div>
  );
}
