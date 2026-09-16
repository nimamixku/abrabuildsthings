"use client";

import { useEffect, useState } from "react";

const BUBBLE_PAUSE_MS = 900;
const START_DELAY_MS = 400;

// A small family of green gradients, cycled by bubble index so
// consecutive bubbles (and bubbles across different pitch cards) don't
// all render as one flat, identical green -- subtle variation reads as
// more alive without breaking the shared brand color.
const BUBBLE_GRADIENTS = [
  "linear-gradient(135deg, #4ade80, #22b562)",
  "linear-gradient(135deg, #34c759, #1f9e48)",
  "linear-gradient(135deg, #3ddc73, #2a8f52)",
  "linear-gradient(135deg, #22c55e, #16803c)",
];

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
        <div
          className="pitch-bubble"
          key={i}
          style={{ background: BUBBLE_GRADIENTS[i % BUBBLE_GRADIENTS.length] }}
        >
          <span className="pitch-bubble-text">{line}</span>
        </div>
      ))}
    </div>
  );
}
