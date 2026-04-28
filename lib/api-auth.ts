import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export function requireAuth(request: NextRequest): { userId: string } | NextResponse {
  const token = getTokenFromRequest(request);
  if (!token) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });
  try {
    const payload = verifyToken(token);
    return { userId: payload.userId as string };
  } catch {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });
  }
}
