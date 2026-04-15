"use client";

import { useState } from "react";
import { User, Lock, Bell, Globe, Save, Eye, EyeOff } from "lucide-react";

type Tab = "profile" | "security" | "notifications" | "preferences";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: "Jan Kowalski",
    email: "jan@example.com",
    phone: "+48 123 456 789",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    transactionReminders: false,
    monthlyReports: true,
    savingsGoals: true,
    emailNotifications: true,
    pushNotifications: false,
  });

  const [preferences, setPreferences] = useState({
    language: "pl",
    currency: "PLN",
    theme: "light",
    dateFormat: "DD/MM/YYYY",
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profil został zaktualizowany!");
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      alert("Hasła nie są identyczne!");
      return;
    }
    alert("Hasło zostało zmienione!");
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Ustawienia powiadomień zostały zapisane!");
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Preferencje zostały zaktualizowane!");
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profil", icon: User },
    { id: "security", label: "Bezpieczeństwo", icon: Lock },
    { id: "notifications", label: "Powiadomienia", icon: Bell },
    { id: "preferences", label: "Preferencje", icon: Globe },
  ];

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-success peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
    </label>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Ustawienia</h1>
        <p className="text-muted-foreground">Zarządzaj swoim kontem i preferencjami</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="border-b border-border">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
              <div>
                <h3 className="mb-4">Informacje osobiste</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="profileName" className="block mb-2">Imię i nazwisko</label>
                    <input
                      id="profileName"
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    />
                  </div>
                  <div>
                    <label htmlFor="profileEmail" className="block mb-2">Email</label>
                    <input
                      id="profileEmail"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    />
                  </div>
                  <div>
                    <label htmlFor="profilePhone" className="block mb-2">Numer telefonu</label>
                    <input
                      id="profilePhone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Save size={18} />
                Zapisz zmiany
              </button>
            </form>
          )}

          {/* Security tab */}
          {activeTab === "security" && (
            <div className="space-y-6 max-w-2xl">
              <form onSubmit={handleSavePassword} className="space-y-6">
                <div>
                  <h3 className="mb-4">Zmiana hasła</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block mb-2">Obecne hasło</label>
                      <div className="relative">
                        <input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={security.currentPassword}
                          onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                          className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showCurrentPassword ? "Ukryj hasło" : "Pokaż hasło"}
                        >
                          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block mb-2">Nowe hasło</label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={security.newPassword}
                          onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                          className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showNewPassword ? "Ukryj hasło" : "Pokaż hasło"}
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block mb-2">Potwierdź nowe hasło</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={security.confirmPassword}
                        onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Save size={18} />
                  Zmień hasło
                </button>
              </form>

              <div className="pt-6 border-t border-border">
                <h3 className="mb-4">Uwierzytelnianie dwuskładnikowe</h3>
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div>
                    <p>2FA (Two-Factor Authentication)</p>
                    <p className="text-sm text-muted-foreground">
                      Dodatkowa warstwa zabezpieczeń dla Twojego konta
                    </p>
                  </div>
                  <Toggle checked={false} onChange={() => {}} />
                </div>
              </div>
            </div>
          )}

          {/* Notifications tab */}
          {activeTab === "notifications" && (
            <form onSubmit={handleSaveNotifications} className="space-y-6 max-w-2xl">
              <div>
                <h3 className="mb-4">Powiadomienia o transakcjach</h3>
                <div className="space-y-3">
                  {(
                    [
                      ["budgetAlerts", "Alerty budżetowe", "Powiadomienia o przekroczeniu budżetu"],
                      ["transactionReminders", "Przypomnienia o transakcjach", "Codzienne przypomnienia o dodaniu transakcji"],
                      ["monthlyReports", "Raporty miesięczne", "Podsumowanie finansów na koniec miesiąca"],
                      ["savingsGoals", "Cele oszczędnościowe", "Aktualizacje postępów w oszczędzaniu"],
                    ] as [keyof typeof notifications, string, string][]
                  ).map(([key, label, desc]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div>
                        <p>{label}</p>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                      <Toggle
                        checked={notifications[key]}
                        onChange={(v) => setNotifications({ ...notifications, [key]: v })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="mb-4">Kanały powiadomień</h3>
                <div className="space-y-3">
                  {(
                    [
                      ["emailNotifications", "Powiadomienia email", "Otrzymuj powiadomienia na email"],
                      ["pushNotifications", "Powiadomienia push", "Powiadomienia w przeglądarce"],
                    ] as [keyof typeof notifications, string, string][]
                  ).map(([key, label, desc]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div>
                        <p>{label}</p>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                      <Toggle
                        checked={notifications[key]}
                        onChange={(v) => setNotifications({ ...notifications, [key]: v })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Save size={18} />
                Zapisz ustawienia
              </button>
            </form>
          )}

          {/* Preferences tab */}
          {activeTab === "preferences" && (
            <form onSubmit={handleSavePreferences} className="space-y-6 max-w-2xl">
              <div>
                <h3 className="mb-4">Regionalne i językowe</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="language" className="block mb-2">Język</label>
                    <select
                      id="language"
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
                    >
                      <option value="pl">Polski</option>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="currency" className="block mb-2">Waluta</label>
                    <select
                      id="currency"
                      value={preferences.currency}
                      onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
                    >
                      <option value="PLN">PLN (zł)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="dateFormat" className="block mb-2">Format daty</label>
                    <select
                      id="dateFormat"
                      value={preferences.dateFormat}
                      onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="mb-4">Wygląd</h3>
                <div>
                  <label htmlFor="theme" className="block mb-2">Motyw</label>
                  <select
                    id="theme"
                    value={preferences.theme}
                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                    className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow cursor-pointer"
                  >
                    <option value="light">Jasny</option>
                    <option value="dark">Ciemny</option>
                    <option value="auto">Automatyczny</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Save size={18} />
                Zapisz preferencje
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-destructive/20">
        <h3 className="mb-4 text-destructive">Strefa zagrożenia</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg">
            <div>
              <p>Usuń konto</p>
              <p className="text-sm text-muted-foreground">
                Permanentnie usuń swoje konto i wszystkie dane
              </p>
            </div>
            <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity">
              Usuń konto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
