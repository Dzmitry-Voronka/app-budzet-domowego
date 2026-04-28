import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  const result = await prisma.budget.deleteMany({ where: { id, userId: auth.userId } });
  if (result.count === 0) return NextResponse.json({ success: false, error: { code: "NOT_FOUND" } }, { status: 404 });
  return NextResponse.json({ success: true });
}
