import { useState } from "react";
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, X } from "lucide-react";

interface Subcategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  type: "expense" | "income";
  color: string;
  subcategories: Subcategory[];
  expanded?: boolean;
}

const initialCategories: Category[] = [
  {
    id: 1,
    name: "Jedzenie",
    type: "expense",
    color: "#10b981",
    subcategories: [
      { id: 101, name: "Zakupy spożywcze" },
      { id: 102, name: "Restauracje" },
      { id: 103, name: "Fast food" },
    ],
    expanded: false,
  },
  {
    id: 2,
    name: "Transport",
    type: "expense",
    color: "#3b82f6",
    subcategories: [
      { id: 201, name: "Paliwo" },
      { id: 202, name: "Komunikacja miejska" },
      { id: 203, name: "Parking" },
    ],
    expanded: false,
  },
  {
    id: 3,
    name: "Rachunki",
    type: "expense",
    color: "#f59e0b",
    subcategories: [
      { id: 301, name: "Prąd" },
      { id: 302, name: "Woda" },
      { id: 303, name: "Internet" },
      { id: 304, name: "Telefon" },
    ],
    expanded: false,
  },
  {
    id: 4,
    name: "Rozrywka",
    type: "expense",
    color: "#8b5cf6",
    subcategories: [
      { id: 401, name: "Kino" },
      { id: 402, name: "Streaming" },
      { id: 403, name: "Hobby" },
    ],
    expanded: false,
  },
  {
    id: 5,
    name: "Pensja",
    type: "income",
    color: "#10b981",
    subcategories: [
      { id: 501, name: "Wynagrodzenie podstawowe" },
      { id: 502, name: "Premie" },
    ],
    expanded: false,
  },
  {
    id: 6,
    name: "Freelance",
    type: "income",
    color: "#06b6d4",
    subcategories: [
      { id: 601, name: "Projekty" },
      { id: 602, name: "Konsultacje" },
    ],
    expanded: false,
  },
];

export function Categories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<"all" | "expense" | "income">("all");

  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expense" as "expense" | "income",
    color: "#10b981",
  });

  const [newSubcategory, setNewSubcategory] = useState("");

  const toggleExpand = (id: number) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, expanded: !cat.expanded } : cat
    ));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const category: Category = {
      id: Math.max(...categories.map(c => c.id)) + 1,
      name: newCategory.name,
      type: newCategory.type,
      color: newCategory.color,
      subcategories: [],
      expanded: false,
    };
    setCategories([...categories, category]);
    setShowAddModal(false);
    setNewCategory({ name: "", type: "expense", color: "#10b981" });
  };

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory === null) return;

    setCategories(categories.map(cat => {
      if (cat.id === selectedCategory) {
        const maxSubId = cat.subcategories.length > 0
          ? Math.max(...cat.subcategories.map(s => s.id))
          : cat.id * 100;
        return {
          ...cat,
          subcategories: [
            ...cat.subcategories,
            { id: maxSubId + 1, name: newSubcategory }
          ]
        };
      }
      return cat;
    }));
    setShowAddSubcategoryModal(false);
    setNewSubcategory("");
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleDeleteSubcategory = (categoryId: number, subcategoryId: number) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId)
        };
      }
      return cat;
    }));
  };

  const filteredCategories = categories.filter(cat =>
    filterType === "all" || cat.type === filterType
  );

  const expenseCategories = filteredCategories.filter(c => c.type === "expense");
  const incomeCategories = filteredCategories.filter(c => c.type === "income");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="mb-2">Kategorie</h1>
          <p className="text-muted-foreground">Zarządzaj kategoriami i podkategoriami transakcji</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={18} />
          Dodaj kategorię
        </button>
      </div>

      {/* Filter tabs */}
      <div className="bg-white rounded-lg shadow-sm p-2 border border-border inline-flex gap-2">
        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterType === "all"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          Wszystkie
        </button>
        <button
          onClick={() => setFilterType("expense")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterType === "expense"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          Wydatki
        </button>
        <button
          onClick={() => setFilterType("income")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterType === "income"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          Przychody
        </button>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense categories */}
        {(filterType === "all" || filterType === "expense") && (
          <div>
            <h3 className="mb-4">Kategorie wydatków</h3>
            <div className="space-y-3">
              {expenseCategories.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 border border-border text-center">
                  <p className="text-muted-foreground">Brak kategorii wydatków</p>
                </div>
              ) : (
                expenseCategories.map((category) => (
                  <div key={category.id} className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => toggleExpand(category.id)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                          aria-label={category.expanded ? "Zwiń" : "Rozwiń"}
                        >
                          {category.expanded ? (
                            <ChevronDown size={20} />
                          ) : (
                            <ChevronRight size={20} />
                          )}
                        </button>
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.subcategories.length} podkategorii
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setShowAddSubcategoryModal(true);
                          }}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          aria-label="Dodaj podkategorię"
                        >
                          <Plus size={16} className="text-muted-foreground" />
                        </button>
                        <button
                          className="p-2 hover:bg-muted rounded transition-colors"
                          aria-label="Edytuj"
                        >
                          <Edit2 size={16} className="text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 hover:bg-destructive/10 rounded transition-colors"
                          aria-label="Usuń"
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </button>
                      </div>
                    </div>
                    {category.expanded && category.subcategories.length > 0 && (
                      <div className="border-t border-border bg-muted/30">
                        {category.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="px-4 py-3 flex items-center justify-between border-b border-border last:border-b-0 hover:bg-accent transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8" /> {/* Spacing for alignment */}
                              <span className="text-sm">{sub.name}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteSubcategory(category.id, sub.id)}
                              className="p-2 hover:bg-destructive/10 rounded transition-colors"
                              aria-label="Usuń podkategorię"
                            >
                              <Trash2 size={14} className="text-destructive" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Income categories */}
        {(filterType === "all" || filterType === "income") && (
          <div>
            <h3 className="mb-4">Kategorie przychodów</h3>
            <div className="space-y-3">
              {incomeCategories.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 border border-border text-center">
                  <p className="text-muted-foreground">Brak kategorii przychodów</p>
                </div>
              ) : (
                incomeCategories.map((category) => (
                  <div key={category.id} className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => toggleExpand(category.id)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                          aria-label={category.expanded ? "Zwiń" : "Rozwiń"}
                        >
                          {category.expanded ? (
                            <ChevronDown size={20} />
                          ) : (
                            <ChevronRight size={20} />
                          )}
                        </button>
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.subcategories.length} podkategorii
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setShowAddSubcategoryModal(true);
                          }}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          aria-label="Dodaj podkategorię"
                        >
                          <Plus size={16} className="text-muted-foreground" />
                        </button>
                        <button
                          className="p-2 hover:bg-muted rounded transition-colors"
                          aria-label="Edytuj"
                        >
                          <Edit2 size={16} className="text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 hover:bg-destructive/10 rounded transition-colors"
                          aria-label="Usuń"
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </button>
                      </div>
                    </div>
                    {category.expanded && category.subcategories.length > 0 && (
                      <div className="border-t border-border bg-muted/30">
                        {category.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="px-4 py-3 flex items-center justify-between border-b border-border last:border-b-0 hover:bg-accent transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8" /> {/* Spacing for alignment */}
                              <span className="text-sm">{sub.name}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteSubcategory(category.id, sub.id)}
                              className="p-2 hover:bg-destructive/10 rounded transition-colors"
                              aria-label="Usuń podkategorię"
                            >
                              <Trash2 size={14} className="text-destructive" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add category modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3>Dodaj kategorię</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-muted rounded transition-colors"
                aria-label="Zamknij"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="block mb-2">Typ</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, type: 'expense' })}
                    className={`p-3 rounded-lg border transition-all ${
                      newCategory.type === 'expense'
                        ? 'border-destructive bg-destructive/10 text-destructive'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    Wydatek
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, type: 'income' })}
                    className={`p-3 rounded-lg border transition-all ${
                      newCategory.type === 'income'
                        ? 'border-success bg-success/10 text-success'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    Przychód
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="categoryName" className="block mb-2">Nazwa kategorii</label>
                <input
                  id="categoryName"
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="np. Zakupy"
                  required
                />
              </div>
              <div>
                <label htmlFor="categoryColor" className="block mb-2">Kolor</label>
                <div className="flex gap-3">
                  <input
                    id="categoryColor"
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="w-16 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="flex-1 px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    placeholder="#10b981"
                  />
                </div>
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

      {/* Add subcategory modal */}
      {showAddSubcategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3>Dodaj podkategorię</h3>
              <button
                onClick={() => setShowAddSubcategoryModal(false)}
                className="p-2 hover:bg-muted rounded transition-colors"
                aria-label="Zamknij"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubcategory} className="p-6 space-y-4">
              <div>
                <label htmlFor="subcategoryName" className="block mb-2">Nazwa podkategorii</label>
                <input
                  id="subcategoryName"
                  type="text"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="np. Supermarket"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddSubcategoryModal(false)}
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
    </div>
  );
}
