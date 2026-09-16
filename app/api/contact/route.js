import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendEmail } from "@/lib/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTIFY_EMAIL = "bibleneworleans@gmail.com";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// The message itself is always logged to the database first -- that's
// the durable record, read back in the on-site message center (see
// app/MessageCenter.js). The email below is just a "you've got one"
// notification, not the system of record: it's sent to Abra's own
// notification address with reply-to set to the visitor, so replying
// is just replying to an email, same pattern as Abracadabra's contact
// form. If email sending isn't configured yet (no RESEND_API_KEY), the
// message still saves fine -- sendEmail no-ops silently in that case.
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }
  if (!message) {
    return NextResponse.json(
      { error: "Message can't be empty." },
      { status: 400 }
    );
  }

  await query(
    `insert into messages (sender_name, sender_email, message) values ($1, $2, $3)`,
    [name, email, message]
  );

  await sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: email,
    subject: `New message from ${name} on Abra Builds Things`,
    html: `
      <p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) sent you a message through Abra Builds Things:</p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      <p style="color:#888;font-size:13px">Reply directly to this email to write back -- it goes straight to them. It's also saved in your site's message center if you'd rather read it there.</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
