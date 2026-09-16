import crypto from "crypto";

export const OWNER_COOKIE_NAME = "abra_owner";

export function ownerToken() {
  const passcode = process.env.OWNER_PASSCODE;
  if (!passcode) return null;
  return crypto.createHash("sha256").update("owner|" + passcode).digest("hex");
}

export function isOwnerRequest(req) {
  const token = ownerToken();
  if (!token) return false;
  const cookie = req.cookies.get(OWNER_COOKIE_NAME)?.value;
  return cookie === token;
}
