"use client";

import { useState } from "react";
import {
  Plus,
  Upload,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Trash2,
  X,
} from "lucide-react";

const mockTransactions = [
  { id: 1, date: "2026-04-14", name: "Zakupy spożywcze", category: "Jedzenie", amount: -245.50, type: "expense" },
  { id: 2, date: "2026-04-14", name: "Kawiarnia", category: "Rozrywka", amount: -28.50, type: "expense" },
  { id: 3, date: "2026-04-13", name: "Restauracja", category: "Rozrywka", amount: -120, type: "expense" },
  { id: 4, date: "2026-04-12", name: "Rachunek za prąd", category: "Rachunki", amount: -180, type: "expense" },
  { id: 5, date: "2026-04-10", name: "Pensja", category: "Przychód", amount: 5500, type: "income" },
  { id: 6, date: "2026-04-08", name: "Zakupy spożywcze", category: "Jedzenie", amount: -315.20, type: "expense" },
  { id: 7, date: "2026-04-05", name: "Paliwo", category: "Transport", amount: -220, type: "expense" },
];

type TransactionType = "income" | "expense";

interface Transaction {
  id: number;
  date: string;
  name: string;
  category: string;
  amount: number;
  type: TransactionType;
}

export default function TransactionsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split("T")[0],
    name: "",
    category: "",
    amount: "",
    type: "expense" as TransactionType,
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction: Transaction = {
      id: transactions.length + 1,
      date: newTransaction.date,
      name: newTransaction.name,
      category: newTransaction.category,
      amount:
        newTransaction.type === "expense"
          ? -Math.abs(parseFloat(newTransaction.amount))
          : Math.abs(parseFloat(newTransaction.amount)),
      type: newTransaction.type,
    };
    setTransactions([transaction, ...transactions]);
    setShowAddModal(false);
    setNewTransaction({
      date: new Date().toISOString().split("T")[0],
      name: "",
      category: "",
      amount: "",
      type: "expense",
    });
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="mb-2">Transakcje</h1>
          <p className="text-muted-foreground">Zarządzaj swoimi przychodami i wydatkami</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
          >
            <Upload size={18} />
            <span className="hidden sm:inline">Import CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus size={18} />
            Dodaj transakcję
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Szukaj transakcji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow appearance-none cursor-pointer"
            >
              <option value="all">Wszystkie transakcje</option>
              <option value="income">Tylko przychody</option>
              <option value="expense">Tylko wydatki</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions list */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-muted-foreground" size={32} />
            </div>
            <h3 className="mb-2">Brak transakcji</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterType !== "all"
                ? "Nie znaleziono transakcji spełniających kryteria wyszukiwania"
                : "Dodaj swoją pierwszą transakcję, aby rozpocząć śledzenie finansów"}
            </p>
            {!searchTerm && filterType === "all" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Dodaj transakcję
              </button>
            )}
          </div>
        ) : (
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
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-accent transition-colors">
                    <td className="px-6 py-4 text-sm text-muted-foreground">{transaction.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            transaction.type === "income"
                              ? "bg-success/10"
                              : "bg-destructive/10"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpRight className="text-success" size={16} />
                          ) : (
                            <ArrowDownRight className="text-destructive" size={16} />
                          )}
                        </div>
                        <span>{transaction.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{transaction.category}</td>
                    <td
                      className={`px-6 py-4 text-right ${
                        transaction.type === "income" ? "text-success" : "text-destructive"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount.toLocaleString("pl-PL")} zł
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 hover:bg-muted rounded transition-colors"
                          aria-label="Edytuj"
                        >
                          <Edit2 size={16} className="text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="p-2 hover:bg-destructive/10 rounded transition-colors"
                          aria-label="Usuń"
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add transaction modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3>Dodaj transakcję</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-muted rounded transition-colors"
                aria-label="Zamknij"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              <div>
                <label className="block mb-2">Typ transakcji</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewTransaction({ ...newTransaction, type: "expense" })}
                    className={`p-3 rounded-lg border transition-all ${
                      newTransaction.type === "expense"
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    Wydatek
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTransaction({ ...newTransaction, type: "income" })}
                    className={`p-3 rounded-lg border transition-all ${
                      newTransaction.type === "income"
                        ? "border-success bg-success/10 text-success"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    Przychód
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="date" className="block mb-2">Data</label>
                <input
                  id="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  required
                />
              </div>
              <div>
                <label htmlFor="name" className="block mb-2">Nazwa</label>
                <input
                  id="name"
                  type="text"
                  value={newTransaction.name}
                  onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="np. Zakupy spożywcze"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block mb-2">Kategoria</label>
                <select
                  id="category"
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
                  required
                >
                  <option value="">Wybierz kategorię</option>
                  {newTransaction.type === "expense" ? (
                    <>
                      <option value="Jedzenie">Jedzenie</option>
                      <option value="Transport">Transport</option>
                      <option value="Rachunki">Rachunki</option>
                      <option value="Rozrywka">Rozrywka</option>
                      <option value="Zdrowie">Zdrowie</option>
                      <option value="Inne">Inne</option>
                    </>
                  ) : (
                    <>
                      <option value="Pensja">Pensja</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Inwestycje">Inwestycje</option>
                      <option value="Inne">Inne</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="amount" className="block mb-2">Kwota (zł)</label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="0.00"
                  required
                />
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
                  Dodaj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import CSV modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3>Import transakcji z CSV</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-2 hover:bg-muted rounded transition-colors"
                aria-label="Zamknij"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
                <p className="mb-2">Przeciągnij plik CSV tutaj</p>
                <p className="text-sm text-muted-foreground mb-4">lub</p>
                <label className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
                  Wybierz plik
                  <input type="file" accept=".csv" className="hidden" />
                </label>
              </div>
              <div className="mt-4 p-4 bg-accent rounded-lg">
                <p className="text-sm mb-2">Format pliku CSV:</p>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  data,nazwa,kategoria,kwota
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
