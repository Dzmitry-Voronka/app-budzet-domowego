import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

const DepositSchema = z.object({ amount: z.number() });

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  try {
    const body = await request.json();
    const { amount } = DepositSchema.parse(body);

    const goal = await prisma.savingsGoal.findFirst({ where: { id, userId: auth.userId } });
    if (!goal) return NextResponse.json({ success: false, error: { code: "NOT_FOUND" } }, { status: 404 });

    const newAmount = Math.max(0, Number(goal.currentAmount) + amount);
    const updated = await prisma.savingsGoal.update({
      where: { id },
      data: {
        currentAmount: newAmount,
        status: newAmount >= Number(goal.targetAmount) ? "COMPLETED" : "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    if (err?.name === "ZodError") return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR" } }, { status: 400 });
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: String(err) } }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  const result = await prisma.savingsGoal.updateMany({ where: { id, userId: auth.userId }, data: { status: "CANCELLED" } });
  if (result.count === 0) return NextResponse.json({ success: false, error: { code: "NOT_FOUND" } }, { status: 404 });
  return NextResponse.json({ success: true });
}
