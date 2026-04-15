import { useState } from "react";
import { Plus, X, Target, ShieldAlert, TrendingUp, Minus } from "lucide-react";

interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

const initialGoals: SavingsGoal[] = [
  { id: 1, name: "Wakacje 2026", targetAmount: 8000, currentAmount: 4500, deadline: "2026-07-01", color: "#3b82f6" },
  { id: 2, name: "Nowy laptop", targetAmount: 5000, currentAmount: 3200, deadline: "2026-06-15", color: "#8b5cf6" },
  { id: 3, name: "Fundusz awaryjny", targetAmount: 15000, currentAmount: 8450, deadline: "2026-12-31", color: "#10b981" },
];

export function Savings() {
  const [goals, setGoals] = useState<SavingsGoal[]>(initialGoals);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
  });

  const emergencyFund = goals.find(g => g.name === "Fundusz awaryjny");
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const goal: SavingsGoal = {
      id: Math.max(...goals.map(g => g.id), 0) + 1,
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline,
      color: "#3b82f6",
    };
    setGoals([...goals, goal]);
    setShowAddModal(false);
    setNewGoal({ name: "", targetAmount: "", deadline: "" });
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGoal === null) return;

    setGoals(goals.map(g => {
      if (g.id === selectedGoal) {
        return {
          ...g,
          currentAmount: g.currentAmount + parseFloat(depositAmount)
        };
      }
      return g;
    }));
    setShowDepositModal(false);
    setDepositAmount("");
    setSelectedGoal(null);
  };

  const handleWithdraw = (goalId: number) => {
    const amount = prompt("Wprowadź kwotę do wypłaty:");
    if (!amount) return;

    setGoals(goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          currentAmount: Math.max(0, g.currentAmount - parseFloat(amount))
        };
      }
      return g;
    }));
  };

  const handleDeleteGoal = (id: number) => {
    if (confirm("Czy na pewno chcesz usunąć ten cel oszczędnościowy?")) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const getPercentage = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="mb-2">Oszczędności</h1>
          <p className="text-muted-foreground">Osiągaj swoje cele finansowe krok po kroku</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={18} />
          Dodaj cel
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-success/10 rounded-lg">
              <TrendingUp className="text-success" size={24} />
            </div>
            <h4>Łącznie zaoszczędzone</h4>
          </div>
          <p className="text-2xl">{totalSaved.toLocaleString('pl-PL')} zł</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="text-primary" size={24} />
            </div>
            <h4>Aktywne cele</h4>
          </div>
          <p className="text-2xl">{goals.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-warning/10 rounded-lg">
              <ShieldAlert className="text-warning" size={24} />
            </div>
            <h4>Fundusz awaryjny</h4>
          </div>
          <p className="text-2xl">{emergencyFund ? emergencyFund.currentAmount.toLocaleString('pl-PL') : '0'} zł</p>
          {emergencyFund && (
            <p className="text-sm text-muted-foreground mt-1">
              {getPercentage(emergencyFund.currentAmount, emergencyFund.targetAmount)}% celu
            </p>
          )}
        </div>
      </div>

      {/* Savings goals */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-border text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="text-muted-foreground" size={32} />
          </div>
          <h3 className="mb-2">Brak celów oszczędnościowych</h3>
          <p className="text-muted-foreground mb-6">
            Dodaj swój pierwszy cel oszczędnościowy i zacznij budować swoją przyszłość finansową
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Dodaj cel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const percentage = getPercentage(goal.currentAmount, goal.targetAmount);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isCompleted = percentage >= 100;

            return (
              <div key={goal.id} className="bg-white rounded-lg shadow-sm p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: goal.color }}
                    />
                    <div>
                      <h3>{goal.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {daysRemaining > 0
                          ? `${daysRemaining} dni do terminu`
                          : daysRemaining === 0
                          ? 'Termin dzisiaj'
                          : `Termin przekroczony o ${Math.abs(daysRemaining)} dni`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1 hover:bg-destructive/10 rounded transition-colors"
                    aria-label="Usuń cel"
                  >
                    <X size={16} className="text-destructive" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Postęp</span>
                      <span className="text-sm">
                        {goal.currentAmount.toLocaleString('pl-PL')} / {goal.targetAmount.toLocaleString('pl-PL')} zł
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full transition-all rounded-full bg-success"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-success">{percentage}%</span>
                      {!isCompleted && (
                        <span className="text-sm text-muted-foreground">
                          Pozostało: {(goal.targetAmount - goal.currentAmount).toLocaleString('pl-PL')} zł
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-sm text-success">✓ Cel osiągnięty!</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedGoal(goal.id);
                        setShowDepositModal(true);
                      }}
                      className="flex-1 px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Wpłać
                    </button>
                    <button
                      onClick={() => handleWithdraw(goal.id)}
                      className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
                    >
                      <Minus size={16} />
                      Wypłać
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tips */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
        <h3 className="mb-4">💡 Wskazówki dotyczące oszczędzania</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-accent rounded-lg">
            <h4 className="mb-2">Zasada 50/30/20</h4>
            <p className="text-sm text-muted-foreground">
              50% na potrzeby, 30% na przyjemności, 20% na oszczędności i spłatę długów
            </p>
          </div>
          <div className="p-4 bg-accent rounded-lg">
            <h4 className="mb-2">Fundusz awaryjny</h4>
            <p className="text-sm text-muted-foreground">
              Zaoszczędź równowartość 3-6 miesięcy wydatków na nieprzewidziane sytuacje
            </p>
          </div>
          <div className="p-4 bg-accent rounded-lg">
            <h4 className="mb-2">Automatyzuj oszczędności</h4>
            <p className="text-sm text-muted-foreground">
              Ustaw automatyczne przelewy na konto oszczędnościowe zaraz po otrzymaniu pensji
            </p>
          </div>
          <div className="p-4 bg-accent rounded-lg">
            <h4 className="mb-2">Małe kroki</h4>
            <p className="text-sm text-muted-foreground">
              Nawet niewielkie kwoty odkładane regularnie sumują się do dużych oszczędności
            </p>
          </div>
        </div>
      </div>

      {/* Add goal modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3>Dodaj cel oszczędnościowy</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-muted rounded transition-colors"
                aria-label="Zamknij"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddGoal} className="p-6 space-y-4">
              <div>
                <label htmlFor="goalName" className="block mb-2">Nazwa celu</label>
                <input
                  id="goalName"
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="np. Wakacje w Hiszpanii"
                  required
                />
              </div>
              <div>
                <label htmlFor="goalTarget" className="block mb-2">Kwota docelowa (zł)</label>
                <input
                  id="goalTarget"
                  type="number"
                  step="0.01"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label htmlFor="goalDeadline" className="block mb-2">Termin</label>
                <input
                  id="goalDeadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
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

      {/* Deposit modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3>Wpłać środki</h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="p-2 hover:bg-muted rounded transition-colors"
                aria-label="Zamknij"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleDeposit} className="p-6 space-y-4">
              <div>
                <label htmlFor="depositAmount" className="block mb-2">Kwota wpłaty (zł)</label>
                <input
                  id="depositAmount"
                  type="number"
                  step="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="0.00"
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Wpłać
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
