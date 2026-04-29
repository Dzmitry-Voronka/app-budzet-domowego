"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { TransactionSchema, type TransactionFormData } from "@/lib/validations";

export default function AddTransactionForm({ onAdded }: { onAdded?: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      type: "EXPENSE",
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    setServerError(null);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw json;
      reset({ date: new Date().toISOString().split("T")[0], type: "EXPENSE" });
      if (onAdded) onAdded();
    } catch (err: unknown) {
      setServerError((err as { error?: { message?: string }; message?: string })?.error?.message ?? (err as { message?: string })?.message ?? "Błąd");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {serverError && <div className="text-sm text-destructive">{serverError}</div>}
      <div>
        <label className="block text-sm">Data</label>
        <input {...register("date")} type="date" className="w-full" />
        {errors.date && <p className="mt-0.5 text-xs text-destructive">{errors.date.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Opis</label>
        <input {...register("description")} className="w-full" />
      </div>
      <div>
        <label className="block text-sm">Kategoria (ID)</label>
        <input {...register("categoryId")} className="w-full" placeholder="UUID kategorii" />
        {errors.categoryId && <p className="mt-0.5 text-xs text-destructive">{errors.categoryId.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Kwota</label>
        <input {...register("amount")} type="number" step="0.01" min="0.01" className="w-full" />
        {errors.amount && <p className="mt-0.5 text-xs text-destructive">{errors.amount.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Typ</label>
        <select {...register("type")} className="w-full">
          <option value="EXPENSE">Wydatek</option>
          <option value="INCOME">Przychód</option>
        </select>
        {errors.type && <p className="mt-0.5 text-xs text-destructive">{errors.type.message}</p>}
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isSubmitting} className="px-3 py-2 bg-primary text-white rounded disabled:opacity-60">
          {isSubmitting ? "Dodawanie..." : "Dodaj"}
        </button>
      </div>
    </form>
  );
}
