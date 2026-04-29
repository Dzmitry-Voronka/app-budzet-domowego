export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getServerUserId } from "@/lib/server-auth";
import TransactionsClient from "./TransactionsClient";

export default async function TransactionsPage() {
  const userId = await getServerUserId();

  const [transactions, categories] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      include: { category: { select: { id: true, name: true, icon: true, color: true } } },
      orderBy: { date: "desc" },
      take: 100,
    }),
    prisma.category.findMany({
      where: { OR: [{ userId }, { userId: null }], isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, type: true },
    }),
  ]);

  const serialized = transactions.map(t => ({
    ...t,
    amount: Number(t.amount),
    date: t.date.toISOString().slice(0, 10),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return <TransactionsClient initialTransactions={serialized} categories={categories} />;
}
