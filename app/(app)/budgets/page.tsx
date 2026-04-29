export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getServerUserId } from "@/lib/server-auth";
import BudgetsClient from "./BudgetsClient";

export default async function BudgetsPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const userId = await getServerUserId();

  const [budgets, categories, transactions] = await Promise.all([
    prisma.budget.findMany({
      where: { userId },
      include: { category: { select: { id: true, name: true, icon: true, color: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { OR: [{ userId }, { userId: null }], type: "EXPENSE", isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.transaction.findMany({
      where: { userId, type: "EXPENSE", date: { gte: monthStart, lte: monthEnd } },
      select: { categoryId: true, amount: true },
    }),
  ]);

  const spentByCategory: Record<string, number> = {};
  for (const t of transactions) {
    spentByCategory[t.categoryId] = (spentByCategory[t.categoryId] ?? 0) + Number(t.amount);
  }

  const budgetsWithSpent = budgets.map(b => ({
    ...b,
    spent: spentByCategory[b.categoryId] ?? 0,
    amountLimit: Number(b.amountLimit),
  }));

  return <BudgetsClient initialBudgets={budgetsWithSpent} categories={categories} />;
}
