import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const monthlyData = [
  { id: "dash-jan", month: "Sty", income: 5000, expenses: 3200 },
  { id: "dash-feb", month: "Lut", income: 5200, expenses: 3800 },
  { id: "dash-mar", month: "Mar", income: 5000, expenses: 4200 },
  { id: "dash-apr", month: "Kwi", income: 5500, expenses: 3500 },
];

const recentTransactions = [
  { id: 1, name: "Zakupy spożywcze", amount: -245.50, category: "Jedzenie", date: "2026-04-14", type: "expense" },
  { id: 2, name: "Pensja", amount: 5500, category: "Przychód", date: "2026-04-10", type: "income" },
  { id: 3, name: "Rachunek za prąd", amount: -180, category: "Rachunki", date: "2026-04-12", type: "expense" },
  { id: 4, name: "Restauracja", amount: -120, category: "Rozrywka", date: "2026-04-13", type: "expense" },
];

const budgetAlerts = [
  { id: 1, category: "Rozrywka", spent: 850, budget: 800, percentage: 106, type: "exceeded" },
  { id: 2, category: "Jedzenie", spent: 1420, budget: 2000, percentage: 71, type: "warning" },
  { id: 3, category: "Transport", spent: 250, budget: 500, percentage: 50, type: "ok" },
];

export function Dashboard() {
  const totalIncome = 5500;
  const totalExpenses = 3500;
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Witaj ponownie, Jan! Oto przegląd Twoich finansów.</p>
      </div>

      {/* Budget alerts */}
      {budgetAlerts.some(alert => alert.type === 'exceeded') && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-destructive flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-destructive mb-1">Przekroczono budżet!</h4>
              <p className="text-sm text-destructive/80">
                Przekroczyłeś budżet w {budgetAlerts.filter(a => a.type === 'exceeded').length} {budgetAlerts.filter(a => a.type === 'exceeded').length === 1 ? 'kategorii' : 'kategoriach'}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-success/10 rounded-lg">
              <TrendingUp className="text-success" size={24} />
            </div>
            <span className="text-xs text-muted-foreground">Ten miesiąc</span>
          </div>
          <h3 className="text-2xl mb-1">+{totalIncome.toLocaleString('pl-PL')} zł</h3>
          <p className="text-sm text-muted-foreground">Przychody</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <TrendingDown className="text-destructive" size={24} />
            </div>
            <span className="text-xs text-muted-foreground">Ten miesiąc</span>
          </div>
          <h3 className="text-2xl mb-1">-{totalExpenses.toLocaleString('pl-PL')} zł</h3>
          <p className="text-sm text-muted-foreground">Wydatki</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="text-primary" size={24} />
            </div>
            <span className="text-xs text-muted-foreground">Saldo</span>
          </div>
          <h3 className="text-2xl mb-1">{balance.toLocaleString('pl-PL')} zł</h3>
          <p className="text-sm text-muted-foreground">Dostępne środki</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-warning/10 rounded-lg">
              <PiggyBank className="text-warning" size={24} />
            </div>
            <span className="text-xs text-muted-foreground">Oszczędności</span>
          </div>
          <h3 className="text-2xl mb-1">8,450 zł</h3>
          <p className="text-sm text-muted-foreground">Cele oszczędnościowe</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
        <h3 className="mb-4">Szybkie akcje</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-accent transition-colors">
            <div className="p-2 bg-success/10 rounded-lg">
              <ArrowUpRight className="text-success" size={20} />
            </div>
            <span className="text-sm">Dodaj przychód</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-accent transition-colors">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <ArrowDownRight className="text-destructive" size={20} />
            </div>
            <span className="text-sm">Dodaj wydatek</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-accent transition-colors">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PiggyBank className="text-primary" size={20} />
            </div>
            <span className="text-sm">Nowy budżet</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-accent transition-colors">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Plus className="text-warning" size={20} />
            </div>
            <span className="text-sm">Cel oszczędnościowy</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <h3 className="mb-6">Przychody vs Wydatki</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#10b981" isAnimationActive={false} />
              <Bar dataKey="expenses" fill="#d4183d" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget status */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <h3 className="mb-6">Status budżetu</h3>
          <div className="space-y-4">
            {budgetAlerts.map((alert) => (
              <div key={alert.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{alert.category}</span>
                  <span className="text-sm">
                    {alert.spent.toLocaleString('pl-PL')} / {alert.budget.toLocaleString('pl-PL')} zł
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      alert.type === 'exceeded'
                        ? 'bg-destructive'
                        : alert.type === 'warning'
                        ? 'bg-warning'
                        : 'bg-success'
                    }`}
                    style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs ${
                    alert.type === 'exceeded'
                      ? 'text-destructive'
                      : alert.type === 'warning'
                      ? 'text-warning'
                      : 'text-success'
                  }`}>
                    {alert.percentage}%
                  </span>
                  {alert.type === 'exceeded' && (
                    <span className="text-xs text-destructive">Przekroczono o {alert.spent - alert.budget} zł</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h3>Ostatnie transakcje</h3>
          <a href="/transactions" className="text-sm text-primary hover:underline">
            Zobacz wszystkie
          </a>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="text-success" size={20} />
                  ) : (
                    <ArrowDownRight className="text-destructive" size={20} />
                  )}
                </div>
                <div>
                  <p>{transaction.name}</p>
                  <p className="text-sm text-muted-foreground">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={transaction.type === 'income' ? 'text-success' : 'text-destructive'}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('pl-PL')} zł
                </p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}