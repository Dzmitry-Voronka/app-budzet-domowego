export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getServerUserId } from "@/lib/server-auth";
import SavingsClient from "./SavingsClient";

export default async function SavingsPage() {
  const userId = await getServerUserId();
  const goals = await prisma.savingsGoal.findMany({
    where: { userId, status: "ACTIVE" },
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
