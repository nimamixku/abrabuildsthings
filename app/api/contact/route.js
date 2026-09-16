import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// No email gets sent anywhere automatically. This just logs the message to the
// database — the site owner reads it in the message center and replies from
// their own regular email using the address the sender provided.
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

  return NextResponse.json({ ok: true });
}
