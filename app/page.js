"use client";

import { useState } from "react";
import PitchBubbles from "./PitchBubbles";
import ContactModal from "./ContactModal";
import MessageCenter from "./MessageCenter";

const CATEGORIES = [
  {
    key: "websites",
    label: "Websites",
    lines: [
      "You need a website. Not a web developer.",
      "If you can use social media, you can run one.",
    ],
  },
  {
    key: "apps",
    label: "Apps",
    lines: [
      "You have an idea for an app. Not the code to build it.",
      "Tell me what it should do. I'll build it.",
    ],
  },
  {
    key: "models",
    label: "AI Models",
    lines: [
      "You want AI that actually knows your thing.",
      "I build that too, trained on your data, not generic answers.",
    ],
  },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="topbar">
        <span className="topbar-brand">Abra Builds Things</span>
        <MessageCenter />
      </header>

      <main>
        <section className="hero">
          <h1>Abra builds things.com</h1>
          <p className="hero-line">
            If you can imagine it, I can build it.
          </p>
          <p className="hero-sub">
            Tell me what you want. I build it. It&apos;s yours. Easy peasy.
            Very simple.
          </p>
          <button className="btn btn-hero" onClick={() => setModalOpen(true)}>
            Tell me what you want built
          </button>
        </section>

        <section className="pitches">
          <h2>I build things &mdash; websites, apps, models, whatever it is</h2>
          <div className="pitch-grid">
            {CATEGORIES.map((cat) => (
              <div className="pitch-card" key={cat.key}>
                <h3>{cat.label}</h3>
                <PitchBubbles lines={cat.lines} />
              </div>
            ))}
          </div>
        </section>

        <footer className="site-footer">
          <p>Got something you want built?</p>
          <button className="btn" onClick={() => setModalOpen(true)}>
            Message me
          </button>
        </footer>
      </main>

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
