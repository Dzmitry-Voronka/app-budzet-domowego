import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { RegisterBaseSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RegisterBaseSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: { code: "USER_EXISTS" } }, { status: 400 });
    }

    const passwordHash = await hashPassword(parsed.password);
    const user = await prisma.user.create({
      data: { name: parsed.name, email: parsed.email, passwordHash },
    });

    const token = signToken({ userId: user.id, email: user.email });
    const res = NextResponse.json({ success: true, data: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
    res.cookies.set({ name: "token", value: token, httpOnly: true, path: "/", secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: String(err) } }, { status: 500 });
  }
}
