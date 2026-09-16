"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

export default function ContactModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;
  if (typeof document === "undefined") return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Try again?");
        return;
      }

      setStatus("sent");
    } catch {
      setStatus("error");
      setErrorMsg("Couldn't reach the server. Try again?");
    }
  }

  function handleClose() {
    setStatus("idle");
    setErrorMsg("");
    setName("");
    setEmail("");
    setMessage("");
    onClose();
  }

  return createPortal(
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose} aria-label="Close">
          &times;
        </button>

        {status === "sent" ? (
          <div className="modal-sent">
            <h3>Got it.</h3>
            <p>
              Thanks — I&apos;ll take a look and get back to you at the email
              you gave me.
            </p>
            <button className="btn" onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3>Tell me what you want built</h3>
            <p className="modal-subtitle">
              Website, app, model &mdash; whatever it is, tell me about it.
            </p>

            <label htmlFor="cm-name">Name</label>
            <input
              id="cm-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="cm-email">Your email</label>
            <input
              id="cm-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="so I can reply to you directly"
            />

            <label htmlFor="cm-message">What do you want built?</label>
            <textarea
              id="cm-message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {status === "error" && <p className="modal-error">{errorMsg}</p>}

            <button className="btn" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
