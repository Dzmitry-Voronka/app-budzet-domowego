import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── GET /api/transactions ──
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const type = searchParams.get("type") as "INCOME" | "EXPENSE" | null;
  const categoryId = searchParams.get("categoryId");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const sortBy = searchParams.get("sortBy") || "date";
  const order = (searchParams.get("order") || "desc") as "asc" | "desc";

  const where: Record<string, unknown> = {};
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
  const body = await request.json();
  const { userId, categoryId, amount, type, description, date } = body;

  if (!userId || !categoryId || !amount || !type || !date) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Brakuje wymaganych pól" } },
      { status: 400 }
    );
  }

  const transaction = await prisma.transaction.create({
    data: {
      user: { connect: { id: userId } },
      category: { connect: { id: categoryId } },
      amount,
      type,
      description,
      date: new Date(date),
    },
    include: { category: { select: { id: true, name: true, icon: true, color: true } } },
  });

  return NextResponse.json({ success: true, data: transaction }, { status: 201 });
}
