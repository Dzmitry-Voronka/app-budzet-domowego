import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

const Schema = z.object({
  categoryId: z.string().uuid(),
  amountLimit: z.number().positive(),
  periodStart: z.string(),
  periodEnd: z.string(),
  alertThreshold: z.number().min(0).max(100).optional(),
});

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const budgets = await prisma.budget.findMany({
    where: { userId: auth.userId },
    include: { category: { select: { id: true, name: true, icon: true, color: true } } },
    orderBy: { periodStart: "desc" },
  });

  return NextResponse.json({ success: true, data: budgets });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const parsed = Schema.parse(body);

    const budget = await prisma.budget.create({
      data: {
        user: { connect: { id: auth.userId } },
        category: { connect: { id: parsed.categoryId } },
        amountLimit: parsed.amountLimit,
        periodStart: new Date(parsed.periodStart),
        periodEnd: new Date(parsed.periodEnd),
        alertThreshold: parsed.alertThreshold ?? 80,
      },
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, data: budget }, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: String(err) } }, { status: 500 });
  }
}
