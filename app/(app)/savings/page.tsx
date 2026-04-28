export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SavingsPage() {
  const goals = await prisma.savingsGoal.findMany();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Oszczędności</h1>
          <p className="text-muted-foreground">Twoje cele oszczędnościowe</p>
        </div>
        <Link href="/savings/new" className="btn">Nowy cel</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g) => {
          const target = Number(g.targetAmount || 0);
          const saved = Number(g.currentAmount || 0);
          const percentage = target ? Math.round((saved / target) * 100) : 0;
          return (
            <div key={g.id} className="bg-white rounded-lg shadow-sm p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <h3>{g.name}</h3>
                <span className="text-sm">{saved} / {target} zł</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
