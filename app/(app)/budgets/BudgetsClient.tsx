"use client";

import { useState } from "react";
import { Plus, Trash2, X, AlertTriangle } from "lucide-react";

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
  const [form, setForm] = useState({
    categoryId: "",
    amountLimit: "",
    alertThreshold: "80",
    periodStart: new Date().toISOString().slice(0, 7) + "-01",
    periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.categoryId || !form.amountLimit) { setError("Wypełnij wymagane pola"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amountLimit: Number(form.amountLimit), alertThreshold: Number(form.alertThreshold) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error("Błąd zapisu");
      setBudgets(prev => [{ ...json.data, spent: 0, amountLimit: Number(json.data.amountLimit) }, ...prev]);
      setShowModal(false);
      setForm({ categoryId: "", amountLimit: "", alertThreshold: "80", periodStart: form.periodStart, periodEnd: form.periodEnd });
    } catch { setError("Wystąpił błąd podczas zapisywania"); }
    finally { setLoading(false); }
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
        <button onClick={() => { setError(""); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={18} /> Nowy budżet
        </button>
      </div>

      {budgets.length === 0 && (
        <div className="bg-white rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground mb-4">Nie masz jeszcze żadnych budżetów</p>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">Dodaj pierwszy budżet</button>
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
              <button onClick={() => setShowModal(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            {error && <p className="mb-4 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Kategoria *</label>
                <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Wybierz kategorię</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Limit (zł) *</label>
                <input type="number" value={form.amountLimit} onChange={e => setForm(f => ({ ...f, amountLimit: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="500" min="0" step="0.01" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Od</label>
                  <input type="date" value={form.periodStart} onChange={e => setForm(f => ({ ...f, periodStart: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Do</label>
                  <input type="date" value={form.periodEnd} onChange={e => setForm(f => ({ ...f, periodEnd: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Alert przy (%): {form.alertThreshold}%</label>
                <input type="range" min="50" max="100" value={form.alertThreshold} onChange={e => setForm(f => ({ ...f, alertThreshold: e.target.value }))} className="w-full" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Anuluj</button>
              <button onClick={handleSave} disabled={loading} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50">
                {loading ? "Zapisywanie..." : "Zapisz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
