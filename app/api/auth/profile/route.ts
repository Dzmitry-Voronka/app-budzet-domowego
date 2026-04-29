import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { ProfileSchema as Schema } from "@/lib/validations";

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const parsed = Schema.parse(body);

    const user = await prisma.user.update({ where: { id: auth.userId }, data: parsed });
    return NextResponse.json({ success: true, data: { id: user.id, name: user.name, email: user.email, currency: user.currency, language: user.language } });
  } catch (err: unknown) {
    if (err instanceof ZodError) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR" } }, { status: 400 });
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: String(err) } }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { id: true, name: true, email: true, currency: true, language: true } });
  if (!user) return NextResponse.json({ success: false, error: { code: "NOT_FOUND" } }, { status: 404 });
  return NextResponse.json({ success: true, data: user });
}
