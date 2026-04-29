import { z } from "zod";

// ---------- Auth ----------

export const LoginSchema = z.object({
  email: z.string().email("Podaj poprawny adres email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

/** Schemat rejestracji bez confirmPassword (używany przez API) */
export const RegisterBaseSchema = z.object({
  name: z.string().min(1, "Imię i nazwisko jest wymagane"),
  email: z.string().email("Podaj poprawny adres email"),
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
});

/** Schemat rejestracji z walidacją confirmPassword (używany przez formularz klienta) */
export const RegisterSchema = RegisterBaseSchema.extend({
  confirmPassword: z.string().min(1, "Potwierdź hasło"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Hasła nie są identyczne",
  path: ["confirmPassword"],
});

export const PasswordSchema = z.object({
  currentPassword: z.string().min(1, "Aktualne hasło jest wymagane"),
  newPassword: z.string().min(8, "Nowe hasło musi mieć co najmniej 8 znaków"),
});

export const ProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  currency: z.string().length(3).optional(),
  language: z.string().optional(),
});

// ---------- Transactions ----------

export const TransactionSchema = z.object({
  categoryId: z.string().uuid("Wybierz poprawną kategorię"),
  amount: z.coerce.number().positive("Kwota musi być większa od 0"),
  type: z.enum(["INCOME", "EXPENSE"], { message: "Wybierz typ transakcji" }),
  description: z.string().optional(),
  date: z.string().min(1, "Data jest wymagana"),
});

// ---------- Budgets ----------

export const BudgetSchema = z.object({
  categoryId: z.string().uuid("Wybierz kategorię"),
  amountLimit: z.coerce.number().positive("Limit musi być większy od 0"),
  periodStart: z.string().min(1, "Data początku okresu jest wymagana"),
  periodEnd: z.string().min(1, "Data końca okresu jest wymagana"),
  alertThreshold: z.coerce.number().min(0).max(100).optional(),
});

// ---------- Categories ----------

export const CategorySchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana").max(100, "Nazwa jest za długa (maks. 100 znaków)"),
  type: z.enum(["INCOME", "EXPENSE"], { message: "Wybierz typ kategorii" }),
  icon: z.string().optional(),
  color: z.string().optional(),
  parentId: z.string().uuid().optional().nullable(),
});

// ---------- Savings goals ----------

export const SavingsGoalSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana").max(200, "Nazwa jest za długa (maks. 200 znaków)"),
  targetAmount: z.coerce.number().positive("Kwota docelowa musi być większa od 0"),
  currentAmount: z.coerce.number().min(0).optional(),
  deadline: z.string().optional().nullable(),
  icon: z.string().optional(),
});

// ---------- Inferred types ----------

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type TransactionFormData = z.infer<typeof TransactionSchema>;
export type BudgetFormData = z.infer<typeof BudgetSchema>;
export type CategoryFormData = z.infer<typeof CategorySchema>;
export type SavingsGoalFormData = z.infer<typeof SavingsGoalSchema>;
export type PasswordFormData = z.infer<typeof PasswordSchema>;
export type ProfileFormData = z.infer<typeof ProfileSchema>;
