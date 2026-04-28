"use client";

import { useState, useEffect } from "react";
import { User, Lock, Save, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [profile, setProfile] = useState({ name: "", email: "", currency: "PLN", language: "pl" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/profile")
      .then(r => r.json())
      .then(json => { if (json.success) setProfile({ name: json.data.name, email: json.data.email, currency: json.data.currency, language: json.data.language }); })
      .finally(() => setProfileLoading(false));
  }, []);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: profile.name, currency: profile.currency, language: profile.language }) });
      await res.json();
      if (!res.ok) throw new Error("Błąd zapisu");
      showMsg("success", "Profil zaktualizowany");
    } catch { showMsg("error", "Nie udało się zapisać profilu"); }
    finally { setLoading(false); }
  };

  const changePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) { showMsg("error", "Nowe hasła nie są identyczne"); return; }
    if (passwords.newPassword.length < 8) { showMsg("error", "Nowe hasło musi mieć co najmniej 8 znaków"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }) });
      const json = await res.json();
      if (json?.error?.code === "WRONG_PASSWORD") throw new Error("Aktualne hasło jest nieprawidłowe");
      if (!res.ok) throw new Error("Błąd zmiany hasła");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showMsg("success", "Hasło zostało zmienione");
    } catch (e: any) { showMsg("error", e.message || "Nie udało się zmienić hasła"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="mb-2">Ustawienia</h1>
        <p className="text-muted-foreground">Zarządzaj swoim kontem</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${message.type === "success" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
          {message.type === "success" && <CheckCircle size={16} />}
          {message.text}
        </div>
      )}

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {([["profile", "Profil", User], ["security", "Hasło", Lock]] as const).map(([tab, label, Icon]) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${activeTab === tab ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="bg-white rounded-lg shadow-sm border border-border p-6 space-y-4">
          <h2 className="mb-2">Dane profilu</h2>
          {profileLoading ? <p className="text-sm text-muted-foreground">Ładowanie...</p> : (
            <>
              <div>
                <label className="block text-sm mb-1">Imię i nazwisko</label>
                <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input value={profile.email} disabled className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Waluta</label>
                  <select value={profile.currency} onChange={e => setProfile(p => ({ ...p, currency: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none">
                    <option value="PLN">PLN — Polski złoty</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="USD">USD — Dolar</option>
                    <option value="GBP">GBP — Funt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Język</label>
                  <select value={profile.language} onChange={e => setProfile(p => ({ ...p, language: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none">
                    <option value="pl">Polski</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              <button onClick={saveProfile} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50">
                <Save size={16} /> {loading ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
            </>
          )}
        </div>
      )}

      {activeTab === "security" && (
        <div className="bg-white rounded-lg shadow-sm border border-border p-6 space-y-4">
          <h2 className="mb-2">Zmiana hasła</h2>
          <div>
            <label className="block text-sm mb-1">Aktualne hasło</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Nowe hasło</label>
            <input type={showPw ? "text" : "password"} value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Min. 8 znaków" />
          </div>
          <div>
            <label className="block text-sm mb-1">Potwierdź nowe hasło</label>
            <input type={showPw ? "text" : "password"} value={passwords.confirmPassword} onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button onClick={changePassword} disabled={loading || !passwords.currentPassword || !passwords.newPassword} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50">
            <Lock size={16} /> {loading ? "Zmiana..." : "Zmień hasło"}
          </button>
        </div>
      )}
    </div>
  );
}
