"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, X, AlertTriangle } from "lucide-react";
import { BudgetSchema, type BudgetFormData } from "@/lib/validations";

type Category = { id: string; name: string };
type Budget = {
  id: string;
  amountLimit: number;
  spent: number;
  alertThreshold: number;
  periodStart: Date | string;
  periodEnd: Date | string;
  category: { id: string; name: string; icon: string | null; color: string | null };
};

export default function BudgetsClient({ initialBudgets, categories }: { initialBudgets: Budget[]; categories: Category[] }) {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [showModal, setShowModal] = useState(false);
  const [serverError, setServerError] = useState("");

  const defaultPeriodStart = new Date().toISOString().slice(0, 7) + "-01";
  const defaultPeriodEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(BudgetSchema),
    defaultValues: {
      alertThreshold: 80,
      periodStart: defaultPeriodStart,
      periodEnd: defaultPeriodEnd,
    },
  });

  const alertThreshold = watch("alertThreshold") ?? 80;

  const openModal = () => {
    setServerError("");
    reset({ alertThreshold: 80, periodStart: defaultPeriodStart, periodEnd: defaultPeriodEnd });
    setShowModal(true);
  };

  const onSubmit = async (data: BudgetFormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error("Błąd zapisu");
      setBudgets(prev => [{ ...json.data, spent: 0, amountLimit: Number(json.data.amountLimit) }, ...prev]);
      setShowModal(false);
    } catch {
      setServerError("Wystąpił błąd podczas zapisywania");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Usunąć ten budżet?")) return;
    await fetch(`/api/budgets/${id}`, { method: "DELETE" });
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Budżety</h1>
          <p className="text-muted-foreground">Kontroluj wydatki według kategorii</p>
        </div>
        <button onClick={openModal} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={18} /> Nowy budżet
        </button>
      </div>

      {budgets.length === 0 && (
        <div className="bg-white rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground mb-4">Nie masz jeszcze żadnych budżetów</p>
          <button onClick={openModal} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">Dodaj pierwszy budżet</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map(b => {
          const pct = Math.min(100, b.amountLimit > 0 ? (b.spent / b.amountLimit) * 100 : 0);
          const exceeded = pct >= 100;
          const warning = pct >= b.alertThreshold && !exceeded;
          const color = exceeded ? "bg-destructive" : warning ? "bg-warning" : "bg-success";
          return (
            <div key={b.id} className="bg-white rounded-lg shadow-sm border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{b.category.icon ?? "📦"}</span>
                  <span className="font-medium">{b.category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {exceeded && <AlertTriangle size={16} className="text-destructive" />}
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 hover:bg-destructive/10 rounded transition-colors"><Trash2 size={14} className="text-destructive" /></button>
                </div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>{b.spent.toLocaleString("pl-PL")} zł wydane</span>
                <span>{b.amountLimit.toLocaleString("pl-PL")} zł limit</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
              </div>
              <p className={`text-xs mt-1 ${exceeded ? "text-destructive" : "text-muted-foreground"}`}>
                {exceeded ? "Przekroczono limit!" : `${Math.round(pct)}% wykorzystano`}
              </p>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2>Nowy budżet</h2>
              <button type="button" onClick={() => setShowModal(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            {serverError && <p className="mb-4 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">{serverError}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Kategoria *</label>
                <select {...register("categoryId")} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Wybierz kategorię</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <p className="mt-0.5 text-xs text-destructive">{errors.categoryId.message}</p>}
              </div>
              <div>
                <label className="block text-sm mb-1">Limit (zł) *</label>
                <input type="number" {...register("amountLimit")} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="500" min="0" step="0.01" />
                {errors.amountLimit && <p className="mt-0.5 text-xs text-destructive">{errors.amountLimit.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Od</label>
                  <input type="date" {...register("periodStart")} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none" />
                  {errors.periodStart && <p className="mt-0.5 text-xs text-destructive">{errors.periodStart.message}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Do</label>
                  <input type="date" {...register("periodEnd")} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none" />
                  {errors.periodEnd && <p className="mt-0.5 text-xs text-destructive">{errors.periodEnd.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Alert przy (%): {alertThreshold}%</label>
                <input type="range" min="50" max="100" {...register("alertThreshold")} className="w-full" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Anuluj</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50">
                  {isSubmitting ? "Zapisywanie..." : "Zapisz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
