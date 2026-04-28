export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import SavingsClient from "./SavingsClient";

export default async function SavingsPage() {
  const goals = await prisma.savingsGoal.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  const serialized = goals.map(g => ({
    ...g,
    targetAmount: Number(g.targetAmount),
    currentAmount: Number(g.currentAmount),
    deadline: g.deadline ? g.deadline.toISOString().slice(0, 10) : null,
    createdAt: g.createdAt.toISOString(),
  }));

  return <SavingsClient initialGoals={serialized} />;
}
