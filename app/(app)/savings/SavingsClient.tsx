"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Target, PlusCircle, MinusCircle, Trash2 } from "lucide-react";
import { SavingsGoalSchema, type SavingsGoalFormData } from "@/lib/validations";

type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  icon: string | null;
};

export default function SavingsClient({ initialGoals }: { initialGoals: Goal[] }) {
  const [goals, setGoals] = useState(initialGoals);
  const [showAdd, setShowAdd] = useState(false);
  const [depositModal, setDepositModal] = useState<{ goal: Goal; type: "deposit" | "withdraw" } | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SavingsGoalFormData>({
    resolver: zodResolver(SavingsGoalSchema),
    defaultValues: { icon: "🎯" },
  });

  const openAdd = () => {
    setServerError("");
    reset({ icon: "🎯", name: "", targetAmount: undefined, deadline: "" });
    setShowAdd(true);
  };

  const onSubmit = async (data: SavingsGoalFormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/savings-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, deadline: data.deadline || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error("Błąd");
      setGoals(prev => [{ ...json.data, targetAmount: Number(json.data.targetAmount), currentAmount: Number(json.data.currentAmount) }, ...prev]);
      setShowAdd(false);
    } catch {
      setServerError("Wystąpił błąd");
    }
  };

  const handleDeposit = async () => {
    if (!depositModal || !depositAmount) return;
    const amount = Number(depositAmount) * (depositModal.type === "withdraw" ? -1 : 1);
    setDepositLoading(true);
    try {
      const res = await fetch(`/api/savings-goals/${depositModal.goal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error("Błąd");
      setGoals(prev => prev.map(g => g.id === depositModal.goal.id ? { ...g, currentAmount: Number(json.data.currentAmount) } : g));
      setDepositModal(null);
      setDepositAmount("");
    } catch { alert("Wystąpił błąd"); }
    finally { setDepositLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Anulować ten cel oszczędnościowy?")) return;
    await fetch(`/api/savings-goals/${id}`, { method: "DELETE" });
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Oszczędności</h1>
          <p className="text-muted-foreground">Śledź swoje cele oszczędnościowe</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={18} /> Nowy cel
        </button>
      </div>

      {goals.length === 0 && (
        <div className="bg-white rounded-lg border border-border p-12 text-center">
          <Target size={40} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">Nie masz jeszcze żadnych celów oszczędnościowych</p>
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">Dodaj pierwszy cel</button>        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(g => {
          const pct = Math.min(100, g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0);
          const remaining = g.targetAmount - g.currentAmount;
          return (
            <div key={g.id} className="bg-white rounded-lg shadow-sm border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{g.icon ?? "🎯"}</span>
                  <span className="font-semibold">{g.name}</span>
                </div>
                <button onClick={() => handleDelete(g.id)} className="p-1.5 hover:bg-destructive/10 rounded"><Trash2 size={14} className="text-destructive" /></button>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>{g.currentAmount.toLocaleString("pl-PL")} zł</span>
                <span>{g.targetAmount.toLocaleString("pl-PL")} zł</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-1">
                <div className="h-full bg-success rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span>{Math.round(pct)}% celu</span>
                {remaining > 0 && <span>Brakuje: {remaining.toLocaleString("pl-PL")} zł</span>}
                {g.deadline && <span>Do: {g.deadline}</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setDepositModal({ goal: g, type: "deposit" }); setDepositAmount(""); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors text-sm">
                  <PlusCircle size={15} /> Wpłać
                </button>
                <button onClick={() => { setDepositModal({ goal: g, type: "withdraw" }); setDepositAmount(""); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-accent transition-colors text-sm" disabled={g.currentAmount <= 0}>
                  <MinusCircle size={15} /> Wypłać
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2>Nowy cel oszczędnościowy</h2>
              <button type="button" onClick={() => setShowAdd(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            {serverError && <p className="mb-4 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">{serverError}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nazwa celu *</label>
                <input {...register("name")} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="np. Wakacje" />
                {errors.name && <p className="mt-0.5 text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm mb-1">Kwota docelowa (zł) *</label>
                <input type="number" {...register("targetAmount")} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="5000" min="0" step="0.01" />
                {errors.targetAmount && <p className="mt-0.5 text-xs text-destructive">{errors.targetAmount.message}</p>}
              </div>
              <div>
                <label className="block text-sm mb-1">Termin (opcjonalnie)</label>
                <input type="date" {...register("deadline")} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm mb-1">Ikona (emoji)</label>
                <input {...register("icon")} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none" placeholder="🎯" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent">Anuluj</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50">
                  {isSubmitting ? "Tworzenie..." : "Utwórz cel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {depositModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2>{depositModal.type === "deposit" ? "Wpłać środki" : "Wypłać środki"}</h2>
              <button onClick={() => setDepositModal(null)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Cel: <strong>{depositModal.goal.name}</strong></p>
            <div>
              <label className="block text-sm mb-1">Kwota (zł)</label>
              <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="100" min="0" step="0.01" autoFocus />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDepositModal(null)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent">Anuluj</button>
              <button onClick={handleDeposit} disabled={loading || !depositAmount} className={`flex-1 px-4 py-2 rounded-lg text-white disabled:opacity-50 ${depositModal.type === "deposit" ? "bg-success hover:opacity-90" : "bg-primary hover:opacity-90"}`}>
                {loading ? "..." : depositModal.type === "deposit" ? "Wpłać" : "Wypłać"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
