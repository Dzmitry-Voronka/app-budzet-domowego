import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

const Schema = z.object({
  categoryId: z.string().uuid().optional(),
  amount: z.number().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  description: z.string().optional(),
  date: z.string().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = Schema.parse(body);

    const existing = await prisma.transaction.findFirst({ where: { id, userId: auth.userId } });
    if (!existing) return NextResponse.json({ success: false, error: { code: "NOT_FOUND" } }, { status: 404 });

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(parsed.categoryId && { category: { connect: { id: parsed.categoryId } } }),
        ...(parsed.amount !== undefined && { amount: parsed.amount }),
        ...(parsed.type && { type: parsed.type }),
        ...(parsed.description !== undefined && { description: parsed.description }),
        ...(parsed.date && { date: new Date(parsed.date) }),
      },
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR" } }, { status: 400 });
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: String(err) } }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  const result = await prisma.transaction.deleteMany({ where: { id, userId: auth.userId } });
  if (result.count === 0) return NextResponse.json({ success: false, error: { code: "NOT_FOUND" } }, { status: 404 });
  return NextResponse.json({ success: true });
}
