"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, ArrowUpRight, ArrowDownRight } from "lucide-react";

type Category = { id: string; name: string; type: string };
type Transaction = {
  id: string;
  date: string;
  description: string | null;
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  category: { id: string; name: string; icon: string | null; color: string | null } | null;
};

const emptyForm = () => ({
  date: new Date().toISOString().slice(0, 10),
  description: "",
  categoryId: "",
  amount: "",
  type: "EXPENSE" as "INCOME" | "EXPENSE",
});

export default function TransactionsClient({ initialTransactions, categories }: { initialTransactions: Transaction[]; categories: Category[] }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

  const openAdd = () => { setEditing(null); setForm(emptyForm()); setError(""); setShowModal(true); };
  const openEdit = (t: Transaction) => {
    setEditing(t);
    setForm({ date: t.date, description: t.description ?? "", categoryId: t.categoryId, amount: String(Math.abs(t.amount)), type: t.type });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.categoryId || !form.amount) { setError("Wybierz kategorię i podaj kwotę"); return; }
    setLoading(true); setError("");
    try {
      const payload = { categoryId: form.categoryId, amount: Number(form.amount), type: form.type, description: form.description || undefined, date: form.date };
      const url = editing ? `/api/transactions/${editing.id}` : "/api/transactions";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Błąd");
      const cat = categories.find(c => c.id === form.categoryId);
      const updated: Transaction = { ...json.data, amount: Number(json.data.amount), date: json.data.date.slice(0, 10), category: json.data.category ?? (cat ? { id: cat.id, name: cat.name, icon: null, color: null } : null) };
      if (editing) {
        setTransactions(prev => prev.map(t => t.id === editing.id ? updated : t));
      } else {
        setTransactions(prev => [updated, ...prev]);
      }
      setShowModal(false);
    } catch (e: any) { setError(e.message || "Wystąpił błąd"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Usunąć tę transakcję?")) return;
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const filtered = transactions.filter(t => filterType === "ALL" || t.type === filterType);
  const totalIncome = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const filteredCategories = categories.filter(c => c.type === form.type);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="mb-2">Transakcje</h1>
          <p className="text-muted-foreground">Zarządzaj swoimi przychodami i wydatkami</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={18} /> Dodaj transakcję
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Przychody</p>
          <p className="text-xl text-success font-semibold">+{totalIncome.toLocaleString("pl-PL")} zł</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Wydatki</p>
          <p className="text-xl text-destructive font-semibold">-{totalExpense.toLocaleString("pl-PL")} zł</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="flex gap-1 p-3 border-b border-border">
          {(["ALL", "INCOME", "EXPENSE"] as const).map(f => (
            <button key={f} onClick={() => setFilterType(f)} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${filterType === f ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"}`}>
              {f === "ALL" ? "Wszystkie" : f === "INCOME" ? "Przychody" : "Wydatki"}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">Data</th>
                <th className="px-4 py-3 text-left text-sm">Opis</th>
                <th className="px-4 py-3 text-left text-sm">Kategoria</th>
                <th className="px-4 py-3 text-right text-sm">Kwota</th>
                <th className="px-4 py-3 text-right text-sm">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">Brak transakcji</td></tr>
              )}
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-muted-foreground">{t.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${t.type === "INCOME" ? "bg-success/10" : "bg-destructive/10"}`}>
                        {t.type === "INCOME" ? <ArrowUpRight size={14} className="text-success" /> : <ArrowDownRight size={14} className="text-destructive" />}
                      </div>
                      <span className="text-sm">{t.description || t.category?.name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{t.category?.name || "—"}</td>
                  <td className={`px-4 py-3 text-right font-medium ${t.type === "INCOME" ? "text-success" : "text-destructive"}`}>
                    {t.type === "INCOME" ? "+" : "-"}{t.amount.toLocaleString("pl-PL")} zł
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(t)} className="p-1.5 hover:bg-muted rounded transition-colors" aria-label="Edytuj"><Edit2 size={14} className="text-muted-foreground" /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 hover:bg-destructive/10 rounded transition-colors" aria-label="Usuń"><Trash2 size={14} className="text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2>{editing ? "Edytuj transakcję" : "Nowa transakcja"}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            {error && <p className="mb-4 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Typ *</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["EXPENSE", "INCOME"] as const).map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, type: t, categoryId: "" }))} className={`py-2 rounded-lg border text-sm transition-colors ${form.type === t ? (t === "EXPENSE" ? "bg-destructive text-white border-destructive" : "bg-success text-white border-success") : "border-border hover:bg-accent"}`}>
                      {t === "EXPENSE" ? "Wydatek" : "Przychód"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Kategoria *</label>
                <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Wybierz kategorię</option>
                  {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Kwota (zł) *</label>
                <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="0.00" min="0" step="0.01" />
              </div>
              <div>
                <label className="block text-sm mb-1">Data *</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm mb-1">Opis (opcjonalnie)</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="np. Biedronka" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent">Anuluj</button>
              <button onClick={handleSave} disabled={loading} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50">
                {loading ? "Zapisywanie..." : editing ? "Zapisz zmiany" : "Dodaj"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
