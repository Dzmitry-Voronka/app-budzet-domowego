import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { z } from "zod";

// ── GET /api/transactions ──
export async function GET(request: NextRequest) {
  // require auth: ensure token belongs to user and filter by userId
  const token = getTokenFromRequest(request);
  if (!token) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });
  let userId: string | null = null;
  try {
    const payload: any = verifyToken(token);
    userId = payload.userId as string;
  } catch {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const type = searchParams.get("type") as "INCOME" | "EXPENSE" | null;
  const categoryId = searchParams.get("categoryId");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const sortBy = searchParams.get("sortBy") || "date";
  const order = (searchParams.get("order") || "desc") as "asc" | "desc";

  const where: Record<string, unknown> = { userId };
  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) (where.date as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) (where.date as Record<string, unknown>).lte = new Date(dateTo);
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: { select: { id: true, name: true, icon: true, color: true } } },
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: transactions,
    meta: { total, page, lastPage: Math.ceil(total / limit), limit },
  });
}

// ── POST /api/transactions ──
export async function POST(request: NextRequest) {
  // auth
  const token = getTokenFromRequest(request);
  if (!token) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });
  let userId: string | null = null;
  try {
    const payload: any = verifyToken(token);
    userId = payload.userId as string;
  } catch {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });
  }

  const body = await request.json();
  const schema = z.object({ categoryId: z.string().uuid(), amount: z.string().or(z.number()), type: z.enum(["INCOME", "EXPENSE"]), description: z.string().optional(), date: z.string() });
  try {
    const parsed = schema.parse(body);
    const transaction = await prisma.transaction.create({
      data: {
        user: { connect: { id: userId } },
        category: { connect: { id: parsed.categoryId } },
        amount: parsed.amount as any,
        type: parsed.type,
        description: parsed.description,
        date: new Date(parsed.date),
      },
      include: { category: { select: { id: true, name: true, icon: true, color: true } } },
    });
    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: String(err) } }, { status: 500 });
  }
}
