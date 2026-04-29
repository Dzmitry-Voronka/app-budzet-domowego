export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getServerUserId } from "@/lib/server-auth";
import Link from "next/link";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react";
import IncomeExpensesChart from "./IncomeExpensesChart";

export default async function DashboardPage() {
  const userId = await getServerUserId();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [transactions, budgets, savingsGoals] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId, date: { gte: monthStart, lte: monthEnd } },
      include: { category: { select: { id: true, name: true } } },
      orderBy: { date: "desc" },
      take: 10,
    }),
    prisma.budget.findMany({ where: { userId }, include: { category: { select: { id: true, name: true } } } }),
    prisma.savingsGoal.findMany({ where: { userId } }),
  ]);

  const totalIncome = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + Math.abs(Number(t.amount)), 0);
  const balance = totalIncome - totalExpenses;

  const budgetAlerts = budgets.map((budget) => {
    const spent = transactions.filter((t) => t.categoryId === budget.categoryId && t.type === "EXPENSE").reduce((s, t) => s + Math.abs(Number(t.amount)), 0);
    const percentage = budget.amountLimit ? Math.round((spent / Number(budget.amountLimit)) * 100) : 0;
    return { id: budget.id, category: budget.category?.name || "", spent, budget: Number(budget.amountLimit || 0), percentage, type: percentage > 100 ? "exceeded" : percentage > 80 ? "warning" : "ok" };
  });

  const monthlyData = Array.from({ length: 4 }).map((_, i) => ({ month: ["Sty", "Lut", "Mar", "Kwi"][i] || "", income: 0, expenses: 0 }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Witaj! Oto przegląd Twoich finansów.</p>
      </div>

      {budgetAlerts.some((a) => a.type === "exceeded") && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-destructive shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-destructive mb-1">Przekroczono budżet!</h4>
              <p className="text-sm text-destructive/80">Sprawdź szczegóły budżetów.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-success/10 rounded-lg">
              <TrendingUp className="text-success" size={24} />
            </div>
            <span className="text-xs text-muted-foreground">Ten miesiąc</span>
          </div>
          <h3 className="text-2xl mb-1">+{totalIncome.toLocaleString("pl-PL")} zł</h3>
          <p className="text-sm text-muted-foreground">Przychody</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <TrendingDown className="text-destructive" size={24} />
            </div>
            <span className="text-xs text-muted-foreground">Ten miesiąc</span>
          </div>
          <h3 className="text-2xl mb-1">-{totalExpenses.toLocaleString("pl-PL")} zł</h3>
          <p className="text-sm text-muted-foreground">Wydatki</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="text-primary" size={24} />
            </div>
            <span className="text-xs text-muted-foreground">Saldo</span>
          </div>
          <h3 className="text-2xl mb-1">{balance.toLocaleString("pl-PL")} zł</h3>
          <p className="text-sm text-muted-foreground">Dostępne środki</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-warning/10 rounded-lg">
              <PiggyBank className="text-warning" size={24} />
            </div>
            <span className="text-xs text-muted-foreground">Oszczędności</span>
          </div>
          <h3 className="text-2xl mb-1">{savingsGoals.reduce((s, g) => s + Number(g.currentAmount || 0), 0).toLocaleString("pl-PL")} zł</h3>
          <p className="text-sm text-muted-foreground">Cele oszczędnościowe</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <h3 className="mb-6">Przychody vs Wydatki</h3>
            {/** Income/Expenses chart (client-only) */}
            <IncomeExpensesChart data={monthlyData} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <h3 className="mb-6">Status budżetu</h3>
          <div className="space-y-4">
            {budgetAlerts.map((alert) => (
              <div key={alert.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{alert.category}</span>
                  <span className="text-sm">{alert.spent.toLocaleString("pl-PL")} / {alert.budget.toLocaleString("pl-PL")} zł</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${alert.type === "exceeded" ? "bg-destructive" : alert.type === "warning" ? "bg-warning" : "bg-success"}`} style={{ width: `${Math.min(alert.percentage, 100)}%` }} />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs ${alert.type === "exceeded" ? "text-destructive" : alert.type === "warning" ? "text-warning" : "text-success"}`}>{alert.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h3>Ostatnie transakcje</h3>
          <Link href="/transactions" className="text-sm text-primary hover:underline">Zobacz wszystkie</Link>
        </div>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${transaction.type === "INCOME" ? "bg-success/10" : "bg-destructive/10"}`}>
                  {transaction.type === "INCOME" ? <ArrowUpRight className="text-success" size={20} /> : <ArrowDownRight className="text-destructive" size={20} />}
                </div>
                <div>
                  <p>{transaction.description || transaction.category?.name}</p>
                  <p className="text-sm text-muted-foreground">{transaction.category?.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={transaction.type === "INCOME" ? "text-success" : "text-destructive"}>{Number(transaction.amount) > 0 ? "+" : ""}{Number(transaction.amount).toLocaleString("pl-PL")} zł</p>
                <p className="text-sm text-muted-foreground">{transaction.date.toISOString().split("T")[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
