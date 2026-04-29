import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

const Schema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = Schema.parse(body);
    const result = await prisma.category.updateMany({ where: { id, userId: auth.userId }, data: parsed });
    if (result.count === 0) return NextResponse.json({ success: false, error: { code: "NOT_FOUND" } }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR" } }, { status: 400 });
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: String(err) } }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  const result = await prisma.category.updateMany({ where: { id, userId: auth.userId }, data: { isActive: false } });
  if (result.count === 0) return NextResponse.json({ success: false, error: { code: "NOT_FOUND" } }, { status: 404 });
  return NextResponse.json({ success: true });
}
