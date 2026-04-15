import { prisma } from "@/lib/prisma";
import AddTransactionForm from "./AddTransactionForm";
import { ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from "lucide-react";

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    include: { category: { select: { id: true, name: true, icon: true, color: true } } },
    orderBy: { date: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="mb-2">Transakcje</h1>
          <p className="text-muted-foreground">Zarządzaj swoimi przychodami i wydatkami</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
        <h2 className="mb-4">Dodaj transakcję</h2>
        {/* Client form */}
        <AddTransactionForm onAdded={undefined} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm">Data</th>
                <th className="px-6 py-3 text-left text-sm">Nazwa</th>
                <th className="px-6 py-3 text-left text-sm">Kategoria</th>
                <th className="px-6 py-3 text-right text-sm">Kwota</th>
                <th className="px-6 py-3 text-right text-sm">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-accent transition-colors">
                  <td className="px-6 py-4 text-sm text-muted-foreground">{t.date.toISOString().split("T")[0]}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${t.type === "INCOME" ? "bg-success/10" : "bg-destructive/10"}`}>
                        {t.type === "INCOME" ? <ArrowUpRight className="text-success" size={16} /> : <ArrowDownRight className="text-destructive" size={16} />}
                      </div>
                      <span>{t.description || t.category?.name || "-"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{t.category?.name || "-"}</td>
                  <td className={`px-6 py-4 text-right ${t.type === "INCOME" ? "text-success" : "text-destructive"}`}>
                    {Number(t.amount) > 0 ? "+" : ""}{Number(t.amount).toLocaleString("pl-PL")} zł
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-muted rounded transition-colors" aria-label="Edytuj"><Edit2 size={16} className="text-muted-foreground" /></button>
                      <button className="p-2 hover:bg-destructive/10 rounded transition-colors" aria-label="Usuń"><Trash2 size={16} className="text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
