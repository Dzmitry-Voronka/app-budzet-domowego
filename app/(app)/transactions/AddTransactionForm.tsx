"use client";

import { useState } from "react";

export default function AddTransactionForm({ onAdded }: { onAdded?: () => void }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!categoryId || !amount) {
      setError("Wypełnij wymagane pola");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, amount: Number(amount), type, description, date }),
      });
      const json = await res.json();
      if (!res.ok) throw json;
      setDescription("");
      setCategoryId("");
      setAmount("");
      setType("EXPENSE");
      if (onAdded) onAdded();
    } catch (err: any) {
      setError(err?.error?.message || err?.message || "Błąd")
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="text-sm text-destructive">{error}</div>}
      <div>
        <label className="block text-sm">Data</label>
        <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full" />
      </div>
      <div>
        <label className="block text-sm">Opis</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full" />
      </div>
      <div>
        <label className="block text-sm">Kategoria (ID)</label>
        <input value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full" />
      </div>
      <div>
        <label className="block text-sm">Kwota</label>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" className="w-full" />
      </div>
      <div>
        <label className="block text-sm">Typ</label>
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full">
          <option value="EXPENSE">Wydatek</option>
          <option value="INCOME">Przychód</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="px-3 py-2 bg-primary text-white rounded">
          {loading ? "Dodawanie..." : "Dodaj"}
        </button>
      </div>
    </form>
  );
}
