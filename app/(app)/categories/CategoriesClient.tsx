"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Tag } from "lucide-react";

type SubCategory = { id: string; name: string; type: "INCOME" | "EXPENSE"; icon: string | null; color: string | null; userId: string | null };
type Category = SubCategory & { subcategories: SubCategory[] };

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"];

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", type: "EXPENSE" as "INCOME" | "EXPENSE", icon: "📦", color: COLORS[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openAdd = () => { setEditing(null); setForm({ name: "", type: "EXPENSE", icon: "📦", color: COLORS[0] }); setError(""); setShowModal(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, type: c.type, icon: c.icon ?? "📦", color: c.color ?? COLORS[0] }); setError(""); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Podaj nazwę kategorii"); return; }
    setLoading(true);
    setError("");
    try {
      const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Błąd");
      if (editing) {
        setCategories(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c));
      } else {
        setCategories(prev => [...prev, { ...json.data, subcategories: [] }]);
      }
      setShowModal(false);
    } catch (e: any) {
      setError(e.message || "Wystąpił błąd");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Usunąć tę kategorię?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const income = categories.filter(c => c.type === "INCOME");
  const expense = categories.filter(c => c.type === "EXPENSE");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Kategorie</h1>
          <p className="text-muted-foreground">Zarządzaj kategoriami wydatków i przychodów</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={18} /> Nowa kategoria
        </button>
      </div>

      {(["INCOME", "EXPENSE"] as const).map(type => (
        <div key={type} className="bg-white rounded-lg shadow-sm border border-border p-6">
          <h2 className="mb-4">{type === "INCOME" ? "Przychody" : "Wydatki"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(type === "INCOME" ? income : expense).map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: c.color ?? "#e5e7eb" }}>
                    {c.icon ?? <Tag size={16} />}
                  </div>
                  <span className="font-medium text-sm">{c.name}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-muted rounded transition-colors"><Pencil size={14} className="text-muted-foreground" /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-destructive/10 rounded transition-colors"><Trash2 size={14} className="text-destructive" /></button>
                </div>
              </div>
            ))}
            {(type === "INCOME" ? income : expense).length === 0 && (
              <p className="text-sm text-muted-foreground col-span-3">Brak kategorii. Dodaj pierwszą!</p>
            )}
          </div>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2>{editing ? "Edytuj kategorię" : "Nowa kategoria"}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            {error && <p className="mb-4 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nazwa *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="np. Jedzenie" />
              </div>
              {!editing && (
                <div>
                  <label className="block text-sm mb-1">Typ *</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none">
                    <option value="EXPENSE">Wydatek</option>
                    <option value="INCOME">Przychód</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm mb-1">Ikona (emoji)</label>
                <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none" placeholder="📦" />
              </div>
              <div>
                <label className="block text-sm mb-2">Kolor</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === c ? "border-primary scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Anuluj</button>
              <button onClick={handleSave} disabled={loading} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? "Zapisywanie..." : "Zapisz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
