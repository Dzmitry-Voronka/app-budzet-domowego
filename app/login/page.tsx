"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginFormData } from "@/lib/validations";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw json;
      router.push("/");
    } catch (err: any) {
      setServerError(
        err?.error?.code === "INVALID_CREDENTIALS"
          ? "Nieprawidłowy email lub hasło"
          : "Wystąpił błąd podczas logowania"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl text-primary mb-2">Budżet Domowy</h1>
            <p className="text-muted-foreground">Zaloguj się do swojego konta</p>
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                />
                <span className="text-foreground">Zapamiętaj mnie</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Zapomniałeś hasła?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <LogIn size={20} />
              {isSubmitting ? "Logowanie..." : "Zaloguj się"}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Nie masz konta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Zarejestruj się
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-accent rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Demo konto:</p>
            <p className="text-xs">Email: jan@example.com</p>
            <p className="text-xs">Hasło: password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
