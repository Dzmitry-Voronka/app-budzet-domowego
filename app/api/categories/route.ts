import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { CategorySchema as Schema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const categories = await prisma.category.findMany({
    where: { OR: [{ userId: auth.userId }, { userId: null }] },
    include: { subcategories: { where: { isActive: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ success: true, data: categories });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const parsed = Schema.parse(body);

    const category = await prisma.category.create({
      data: { ...parsed, userId: auth.userId },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", issues: err.issues } }, { status: 400 });
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: String(err) } }, { status: 500 });
  }
}
