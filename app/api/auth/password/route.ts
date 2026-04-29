import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { comparePassword, hashPassword } from "@/lib/auth";
import { PasswordSchema as Schema } from "@/lib/validations";

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const parsed = Schema.parse(body);

    const user = await prisma.user.findUnique({ where: { id: auth.userId } });
    if (!user?.passwordHash) return NextResponse.json({ success: false, error: { code: "NOT_FOUND" } }, { status: 404 });

    const ok = await comparePassword(parsed.currentPassword, user.passwordHash);
    if (!ok) return NextResponse.json({ success: false, error: { code: "WRONG_PASSWORD" } }, { status: 400 });

    const passwordHash = await hashPassword(parsed.newPassword);
    await prisma.user.update({ where: { id: auth.userId }, data: { passwordHash } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.name === "ZodError") return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR" } }, { status: 400 });
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: String(err) } }, { status: 500 });
  }
}
