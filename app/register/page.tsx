"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterFormData } from "@/lib/validations";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) throw json;
      router.push("/");
    } catch (err: unknown) {
      const e = err as { error?: { code?: string } };
      if (e?.error?.code === "USER_EXISTS") {
        setServerError("Użytkownik o tym adresie email już istnieje");
      } else if (e?.error?.code === "VALIDATION_ERROR") {
        setServerError("Dane są niepoprawne. Hasło musi mieć co najmniej 8 znaków.");
      } else {
        setServerError("Wystąpił błąd podczas rejestracji. Spróbuj ponownie.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl text-primary mb-2">Budżet Domowy</h1>
            <p className="text-muted-foreground">Utwórz nowe konto</p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-foreground">
                Imię i nazwisko
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                placeholder="Jan Kowalski"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                placeholder="jan@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-foreground">
                Hasło
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-foreground">
                Potwierdź hasło
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? "Ukryj hasło" : "Pokaż hasło"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <UserPlus size={20} />
              {isSubmitting ? "Rejestrowanie..." : "Zarejestruj się"}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Masz już konto?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Zaloguj się
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
