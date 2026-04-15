"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { id: "rep-jan", month: "Sty", income: 5000, expenses: 3200 },
  { id: "rep-feb", month: "Lut", income: 5200, expenses: 3800 },
  { id: "rep-mar", month: "Mar", income: 5000, expenses: 4200 },
  { id: "rep-apr", month: "Kwi", income: 5500, expenses: 3500 },
];

const categoryData = [
  { id: "cat-food", name: "Jedzenie", value: 1420, color: "#10b981" },
  { id: "cat-trans", name: "Transport", value: 250, color: "#3b82f6" },
  { id: "cat-bills", name: "Rachunki", value: 980, color: "#f59e0b" },
  { id: "cat-fun", name: "Rozrywka", value: 850, color: "#8b5cf6" },
];

const trendData = [
  { id: "trend-jan", month: "Sty", savings: 1800 },
  { id: "trend-feb", month: "Lut", savings: 1400 },
  { id: "trend-mar", month: "Mar", savings: 800 },
  { id: "trend-apr", month: "Kwi", savings: 2000 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("04");

  const handleExport = (format: "pdf" | "csv" | "xlsx") => {
    alert(`Eksportowanie raportu do formatu ${format.toUpperCase()}...`);
  };

  const totalIncome = monthlyData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = monthlyData.reduce((sum, item) => sum + item.expenses, 0);
  const totalSavings = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="mb-2">Raporty finansowe</h1>
          <p className="text-muted-foreground">Analizuj swoje finanse za pomocą wykresów i raportów</p>
        </div>
        <div className="flex gap-2">
          {(["pdf", "csv", "xlsx"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleExport(fmt)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
            >
              <Download size={18} />
              {fmt === "xlsx" ? "Excel" : fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm">Okres</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as "week" | "month" | "year")}
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
            >
              <option value="week">Tydzień</option>
              <option value="month">Miesiąc</option>
              <option value="year">Rok</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm">Rok</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm">Miesiąc</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
            >
              <option value="01">Styczeń</option>
              <option value="02">Luty</option>
              <option value="03">Marzec</option>
              <option value="04">Kwiecień</option>
              <option value="05">Maj</option>
              <option value="06">Czerwiec</option>
              <option value="07">Lipiec</option>
              <option value="08">Sierpień</option>
              <option value="09">Wrzesień</option>
              <option value="10">Październik</option>
              <option value="11">Listopad</option>
              <option value="12">Grudzień</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-border text-center">
          <p className="text-sm text-muted-foreground mb-2">Łączne przychody</p>
          <p className="text-2xl text-success">+{totalIncome.toLocaleString("pl-PL")} zł</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-border text-center">
          <p className="text-sm text-muted-foreground mb-2">Łączne wydatki</p>
          <p className="text-2xl text-destructive">-{totalExpenses.toLocaleString("pl-PL")} zł</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-border text-center">
          <p className="text-sm text-muted-foreground mb-2">Oszczędności</p>
          <p className={`text-2xl ${totalSavings >= 0 ? "text-success" : "text-destructive"}`}>
            {totalSavings >= 0 ? "+" : ""}
            {totalSavings.toLocaleString("pl-PL")} zł
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <h3 className="mb-6">Przychody vs Wydatki</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Przychody" isAnimationActive={false} />
              <Bar dataKey="expenses" fill="#d4183d" name="Wydatki" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown pie */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <h3 className="mb-6">Wydatki wg kategorii</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                isAnimationActive={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Savings trend */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <h3 className="mb-6">Trend oszczędności</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="#10b981"
                strokeWidth={2}
                name="Oszczędności"
                dot={{ fill: "#10b981", r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category detail */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <h3 className="mb-6">Szczegóły kategorii</h3>
          <div className="space-y-4">
            {categoryData.map((category) => {
              const total = categoryData.reduce((sum, c) => sum + c.value, 0);
              const percentage = Math.round((category.value / total) * 100);
              return (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <span className="text-sm">{category.value.toLocaleString("pl-PL")} zł</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${percentage}%`, backgroundColor: category.color }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {percentage}% całkowitych wydatków
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly comparison table */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
        <h3 className="mb-6">Porównanie miesięczne</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm">Miesiąc</th>
                <th className="px-6 py-3 text-right text-sm">Przychody</th>
                <th className="px-6 py-3 text-right text-sm">Wydatki</th>
                <th className="px-6 py-3 text-right text-sm">Oszczędności</th>
                <th className="px-6 py-3 text-right text-sm">% oszczędności</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {monthlyData.map((item, index) => {
                const savings = item.income - item.expenses;
                const savingsRate = Math.round((savings / item.income) * 100);
                return (
                  <tr key={index} className="hover:bg-accent transition-colors">
                    <td className="px-6 py-4">{item.month} 2026</td>
                    <td className="px-6 py-4 text-right text-success">
                      +{item.income.toLocaleString("pl-PL")} zł
                    </td>
                    <td className="px-6 py-4 text-right text-destructive">
                      -{item.expenses.toLocaleString("pl-PL")} zł
                    </td>
                    <td
                      className={`px-6 py-4 text-right ${savings >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      {savings >= 0 ? "+" : ""}
                      {savings.toLocaleString("pl-PL")} zł
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                          savingsRate >= 20
                            ? "bg-success/10 text-success"
                            : savingsRate >= 10
                            ? "bg-warning/10 text-warning"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {savingsRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
        <h3 className="mb-4">Wnioski i rekomendacje</h3>
        <div className="space-y-3">
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <h4 className="text-success mb-1">Dobra praca!</h4>
            <p className="text-sm text-muted-foreground">
              Twój wskaźnik oszczędności wynosi 36%, co jest powyżej zalecanego minimum 20%.
            </p>
          </div>
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <h4 className="text-warning mb-1">Uwaga na wydatki</h4>
            <p className="text-sm text-muted-foreground">
              Wydatki na rozrywkę przekroczyły budżet o 6%. Rozważ ograniczenie tych wydatków w
              przyszłym miesiącu.
            </p>
          </div>
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <h4 className="text-primary mb-1">Sugestia</h4>
            <p className="text-sm text-muted-foreground">
              Możesz zwiększyć oszczędności o dodatkowe 200 zł miesięcznie, ograniczając wydatki
              na jedzenie poza domem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
