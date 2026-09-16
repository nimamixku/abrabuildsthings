// Shared Resend sender, same "best-effort, never throws" contract as
// Abracadabra's lib/resend.js -- a bad moment from the email provider
// should never break the actual contact form, which already saved the
// message to the database before this ever gets called.
//
// RESEND_API_KEY + RESEND_FROM_EMAIL are required. RESEND_FROM_EMAIL can
// be Resend's own "onboarding@resend.dev" sender (works out of the box,
// no domain verification needed) since this only ever sends to your own
// notification address, not to arbitrary visitors.
export async function sendEmail({ to, subject, html, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from || !to) {
    return { sent: false, reason: "not_configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Resend send failed:", res.status, body);
      return { sent: false, reason: "provider_error" };
    }
    return { sent: true };
  } catch (err) {
    console.error("Resend send failed:", err);
    return { sent: false, reason: "network_error" };
  }
}
