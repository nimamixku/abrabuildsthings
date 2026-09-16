"use client";

import { useEffect, useState } from "react";

export default function MessageCenter() {
  const [isOwner, setIsOwner] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    fetch("/api/owner")
      .then((r) => r.json())
      .then((data) => {
        setIsOwner(!!data.isOwner);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/owner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setLoginError(data.error || "Wrong passcode.");
      return;
    }
    setIsOwner(true);
    setShowLogin(false);
    setPasscode("");
  }

  async function handleLogout() {
    await fetch("/api/owner", { method: "DELETE" });
    setIsOwner(false);
    setExpanded(false);
    setMessages([]);
  }

  async function toggleExpanded() {
    if (!expanded && messages.length === 0) {
      setLoadingMessages(true);
      const res = await fetch("/api/messages");
      const data = await res.json().catch(() => ({}));
      setMessages(data.messages || []);
      setLoadingMessages(false);
    }
    setExpanded(!expanded);
  }

  if (!checked) return null;

  return (
    <div className="message-center">
      {!isOwner ? (
        showLogin ? (
          <form className="owner-login" onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              autoFocus
            />
            <button className="btn-small" type="submit">
              Go
            </button>
            {loginError && <span className="owner-login-error">{loginError}</span>}
          </form>
        ) : (
          <button className="owner-signin-link" onClick={() => setShowLogin(true)}>
            🔑 sign in
          </button>
        )
      ) : (
        <div className="owner-panel">
          <button className="owner-toggle" onClick={toggleExpanded}>
            🔑 signed in &mdash; {expanded ? "hide" : "show"} messages (
            {messages.length}) &mdash;
          </button>
          <button className="owner-signout" onClick={handleLogout}>
            sign out
          </button>

          {expanded && (
            <div className="messages-list">
              {loadingMessages && <p>Loading...</p>}
              {!loadingMessages && messages.length === 0 && (
                <p>No messages yet.</p>
              )}
              {messages.map((m) => (
                <div className="message-item" key={m.id}>
                  <div className="message-item-head">
                    <strong>{m.sender_name}</strong>
                    <a href={`mailto:${m.sender_email}`}>{m.sender_email}</a>
                    <span className="message-item-date">
                      {new Date(m.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="message-item-body">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
