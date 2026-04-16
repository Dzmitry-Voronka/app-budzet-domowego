import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret";

export function signToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function getTokenFromRequest(req: NextRequest) {
  try {
    // cookie first
    const cookie = req.cookies?.get?.("token")?.value;
    if (cookie) return cookie;
    // fallback to Authorization header
    const auth = req.headers.get("authorization");
    if (!auth) return null;
    const parts = auth.split(" ");
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") return parts[1];
    return null;
  } catch {
    return null;
  }
}

export function setTokenCookie(res: Response | any, token: string) {
  // In route handlers we'll set cookie via NextResponse
  // helper exists for future use
  return token;
}
