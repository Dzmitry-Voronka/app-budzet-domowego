export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default async function BudgetsPage() {
  const budgets = await prisma.budget.findMany({ include: { category: { select: { id: true, name: true } } } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Budżety</h1>
          <p className="text-muted-foreground">Zarządzaj swoimi budżetami kategorii</p>
        </div>
        <Link href="/budgets/new" className="btn">
          <PlusCircle className="mr-2" /> Nowy budżet
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((b) => {
          const amount = Number(b.amountLimit || 0);
          const spent = 0;
          const percentage = amount ? Math.round((spent / amount) * 100) : 0;
          return (
            <div key={b.id} className="bg-white rounded-lg shadow-sm p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <h3>{b.category?.name}</h3>
                <span className="text-sm">{spent} / {amount} zł</span>
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
