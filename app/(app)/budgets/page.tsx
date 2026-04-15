"use client";

import { useState } from "react";
import { Plus, X, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";

interface Budget {
  id: number;
  category: string;
  amount: number;
  spent: number;
  period: "monthly" | "weekly" | "yearly";
  color: string;
}

const initialBudgets: Budget[] = [
  { id: 1, category: "Jedzenie", amount: 2000, spent: 1420, period: "monthly", color: "#10b981" },
  { id: 2, category: "Transport", amount: 500, spent: 250, period: "monthly", color: "#3b82f6" },
  { id: 3, category: "Rozrywka", amount: 800, spent: 850, period: "monthly", color: "#8b5cf6" },
  { id: 4, category: "Rachunki", amount: 1200, spent: 980, period: "monthly", color: "#f59e0b" },
  { id: 5, category: "Zdrowie", amount: 400, spent: 120, period: "monthly", color: "#ef4444" },
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
    period: "monthly" as "monthly" | "weekly" | "yearly",
  });

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const budget: Budget = {
      id: Math.max(...budgets.map((b) => b.id), 0) + 1,
      category: newBudget.category,
      amount: parseFloat(newBudget.amount),
      spent: 0,
      period: newBudget.period,
      color: "#10b981",
    };
    setBudgets([...budgets, budget]);
    setShowAddModal(false);
    setNewBudget({ category: "", amount: "", period: "monthly" });
  };

  const handleDeleteBudget = (id: number) => {
    setBudgets(budgets.filter((b) => b.id !== id));
  };

  const getPercentage = (spent: number, amount: number) =>
    Math.round((spent / amount) * 100);

  const getStatus = (percentage: number) => {
    if (percentage >= 100) return "exceeded";
    if (percentage >= 80) return "warning";
    return "ok";
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalPercentage = getPercentage(totalSpent, totalBudget);
  const totalStatus = getStatus(totalPercentage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="mb-2">Budżety</h1>
          <p className="text-muted-foreground">Planuj i śledź swoje wydatki w różnych kategoriach</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={18} />
          Utwórz budżet
        </button>
      </div>

      {/* Overall summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3>Podsumowanie miesięczne</h3>
          <span className="text-sm text-muted-foreground">
            {totalSpent.toLocaleString("pl-PL")} / {totalBudget.toLocaleString("pl-PL")} zł
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-4 overflow-hidden mb-2">
          <div
            className={`h-full transition-all rounded-full ${
              totalStatus === "exceeded"
                ? "bg-destructive"
                : totalStatus === "warning"
                ? "bg-warning"
                : "bg-success"
            }`}
            style={{ width: `${Math.min(totalPercentage, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span
            className={`text-sm ${
              totalStatus === "exceeded"
                ? "text-destructive"
                : totalStatus === "warning"
                ? "text-warning"
                : "text-success"
            }`}
          >
            {totalPercentage}% wykorzystane
          </span>
          <span className="text-sm text-muted-foreground">
            Pozostało: {(totalBudget - totalSpent).toLocaleString("pl-PL")} zł
          </span>
        </div>
      </div>

      {/* Alerts */}
      {budgets.filter((b) => getStatus(getPercentage(b.spent, b.amount)) === "exceeded").length >
        0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-destructive flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-destructive mb-1">Uwaga! Przekroczono budżet</h4>
              <p className="text-sm text-destructive/80">
                {budgets
                  .filter((b) => getStatus(getPercentage(b.spent, b.amount)) === "exceeded")
                  .map((b) => b.category)
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Budgets list */}
      {budgets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-border text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-muted-foreground" size={32} />
          </div>
          <h3 className="mb-2">Brak budżetów</h3>
          <p className="text-muted-foreground mb-6">
            Utwórz swój pierwszy budżet, aby zacząć kontrolować wydatki
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Utwórz budżet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => {
            const percentage = getPercentage(budget.spent, budget.amount);
            const status = getStatus(percentage);

            return (
              <div key={budget.id} className="bg-white rounded-lg shadow-sm p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: budget.color }}
                    />
                    <div>
                      <h4>{budget.category}</h4>
                      <p className="text-sm text-muted-foreground">
                        {budget.period === "monthly"
                          ? "Miesięczny"
                          : budget.period === "weekly"
                          ? "Tygodniowy"
                          : "Roczny"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBudget(budget.id)}
                    className="p-1 hover:bg-destructive/10 rounded transition-colors"
                    aria-label="Usuń budżet"
                  >
                    <X size={16} className="text-destructive" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Wydano</span>
                    <span>{budget.spent.toLocaleString("pl-PL")} zł</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budżet</span>
                    <span>{budget.amount.toLocaleString("pl-PL")} zł</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pozostało</span>
                    <span className={status === "exceeded" ? "text-destructive" : "text-success"}>
                      {(budget.amount - budget.spent).toLocaleString("pl-PL")} zł
                    </span>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2 overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all rounded-full ${
                      status === "exceeded"
                        ? "bg-destructive"
                        : status === "warning"
                        ? "bg-warning"
                        : "bg-success"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {status === "exceeded" && (
                      <AlertTriangle size={14} className="text-destructive" />
                    )}
                    {status === "ok" && <CheckCircle2 size={14} className="text-success" />}
                    <span
                      className={`text-sm ${
                        status === "exceeded"
                          ? "text-destructive"
                          : status === "warning"
                          ? "text-warning"
                          : "text-success"
                      }`}
                    >
                      {percentage}%
                    </span>
                  </div>
                  {status === "exceeded" && (
                    <span className="text-xs text-destructive">
                      Przekroczono o {(budget.spent - budget.amount).toLocaleString("pl-PL")} zł
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add budget modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3>Utwórz nowy budżet</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-muted rounded transition-colors"
                aria-label="Zamknij"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddBudget} className="p-6 space-y-4">
              <div>
                <label htmlFor="budgetCategory" className="block mb-2">Kategoria</label>
                <select
                  id="budgetCategory"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
                  required
                >
                  <option value="">Wybierz kategorię</option>
                  <option value="Jedzenie">Jedzenie</option>
                  <option value="Transport">Transport</option>
                  <option value="Rachunki">Rachunki</option>
                  <option value="Rozrywka">Rozrywka</option>
                  <option value="Zdrowie">Zdrowie</option>
                  <option value="Edukacja">Edukacja</option>
                  <option value="Ubrania">Ubrania</option>
                  <option value="Inne">Inne</option>
                </select>
              </div>
              <div>
                <label htmlFor="budgetPeriod" className="block mb-2">Okres</label>
                <select
                  id="budgetPeriod"
                  value={newBudget.period}
                  onChange={(e) =>
                    setNewBudget({
                      ...newBudget,
                      period: e.target.value as "monthly" | "weekly" | "yearly",
                    })
                  }
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
                  required
                >
                  <option value="weekly">Tygodniowy</option>
                  <option value="monthly">Miesięczny</option>
                  <option value="yearly">Roczny</option>
                </select>
              </div>
              <div>
                <label htmlFor="budgetAmount" className="block mb-2">Kwota (zł)</label>
                <input
                  id="budgetAmount"
                  type="number"
                  step="0.01"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Otrzymasz powiadomienie, gdy wykorzystasz 80% budżetu i gdy go przekroczysz.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Utwórz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
