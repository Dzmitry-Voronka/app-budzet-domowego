import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { SavingsGoalSchema as Schema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const goals = await prisma.savingsGoal.findMany({
    where: { userId: auth.userId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: goals });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const parsed = Schema.parse(body);

    const goal = await prisma.savingsGoal.create({
      data: {
        user: { connect: { id: auth.userId } },
        name: parsed.name,
        targetAmount: parsed.targetAmount,
        currentAmount: parsed.currentAmount ?? 0,
        deadline: parsed.deadline ? new Date(parsed.deadline) : null,
        icon: parsed.icon,
      },
    });

    return NextResponse.json({ success: true, data: goal }, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: String(err) } }, { status: 500 });
  }
}
