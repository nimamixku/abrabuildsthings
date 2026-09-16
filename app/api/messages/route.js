import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { isOwnerRequest } from "@/lib/ownerAuth";

export async function GET(req) {
  if (!isOwnerRequest(req)) {
    return NextResponse.json(
      { error: "Sign in to see messages." },
      { status: 403 }
    );
  }

  const result = await query(
    `select id, sender_name, sender_email, message, created_at
     from messages
     order by created_at desc`
  );

  return NextResponse.json({ messages: result.rows });
}
