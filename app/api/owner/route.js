import { NextResponse } from "next/server";
import { OWNER_COOKIE_NAME, ownerToken, isOwnerRequest } from "@/lib/ownerAuth";

export async function GET(req) {
  return NextResponse.json({ isOwner: isOwnerRequest(req) });
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const passcode = typeof body.passcode === "string" ? body.passcode : "";

  const expected = process.env.OWNER_PASSCODE;
  if (!expected) {
    return NextResponse.json(
      { error: "Owner passcode isn't set up yet." },
      { status: 500 }
    );
  }

  if (passcode !== expected) {
    return NextResponse.json({ error: "Wrong passcode." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(OWNER_COOKIE_NAME, ownerToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(OWNER_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
