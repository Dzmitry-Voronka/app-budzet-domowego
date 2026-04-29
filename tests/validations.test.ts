import { describe, it, expect } from "vitest";
import {
  LoginSchema,
  RegisterBaseSchema,
  RegisterSchema,
  TransactionSchema,
  BudgetSchema,
  CategorySchema,
  SavingsGoalSchema,
  PasswordSchema,
} from "../lib/validations";

// ---------------------------------------------------------------------------
// LoginSchema
// ---------------------------------------------------------------------------
describe("LoginSchema", () => {
  it("accepts valid credentials", () => {
    const result = LoginSchema.safeParse({ email: "user@example.com", password: "secret" });
    expect(result.success).toBe(true);
  });

  it("rejects missing email", () => {
    const result = LoginSchema.safeParse({ email: "", password: "secret" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email format", () => {
    const result = LoginSchema.safeParse({ email: "not-an-email", password: "secret" });
    expect(result.success).toBe(false);
  });

  it("rejects missing password", () => {
    const result = LoginSchema.safeParse({ email: "user@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// RegisterBaseSchema (used by API)
// ---------------------------------------------------------------------------
describe("RegisterBaseSchema", () => {
  it("accepts valid registration data", () => {
    const result = RegisterBaseSchema.safeParse({
      name: "Jan Kowalski",
      email: "jan@example.com",
      password: "haslo1234",
    });
    expect(result.success).toBe(true);
  });

  it("rejects password shorter than 8 characters", () => {
    const result = RegisterBaseSchema.safeParse({
      name: "Jan",
      email: "jan@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = RegisterBaseSchema.safeParse({
      name: "",
      email: "jan@example.com",
      password: "haslo1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = RegisterBaseSchema.safeParse({
      name: "Jan",
      email: "invalidemail",
      password: "haslo1234",
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// RegisterSchema (used by client — includes confirmPassword)
// ---------------------------------------------------------------------------
describe("RegisterSchema", () => {
  it("accepts matching passwords", () => {
    const result = RegisterSchema.safeParse({
      name: "Jan",
      email: "jan@example.com",
      password: "haslo1234",
      confirmPassword: "haslo1234",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-matching passwords", () => {
    const result = RegisterSchema.safeParse({
      name: "Jan",
      email: "jan@example.com",
      password: "haslo1234",
      confirmPassword: "innehaslo",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmErr = result.error.issues.find((i) => i.path.includes("confirmPassword"));
      expect(confirmErr).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// TransactionSchema
// ---------------------------------------------------------------------------
describe("TransactionSchema", () => {
  const validUUID = "123e4567-e89b-12d3-a456-426614174000";

  it("accepts valid EXPENSE transaction", () => {
    const result = TransactionSchema.safeParse({
      categoryId: validUUID,
      amount: 150.5,
      type: "EXPENSE",
      date: "2026-04-29",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid INCOME transaction", () => {
    const result = TransactionSchema.safeParse({
      categoryId: validUUID,
      amount: "3000",
      type: "INCOME",
      date: "2026-04-29",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.amount).toBe("number");
      expect(result.data.amount).toBe(3000);
    }
  });

  it("rejects negative amount", () => {
    const result = TransactionSchema.safeParse({
      categoryId: validUUID,
      amount: -50,
      type: "EXPENSE",
      date: "2026-04-29",
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero amount", () => {
    const result = TransactionSchema.safeParse({
      categoryId: validUUID,
      amount: 0,
      type: "EXPENSE",
      date: "2026-04-29",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-UUID categoryId", () => {
    const result = TransactionSchema.safeParse({
      categoryId: "not-a-uuid",
      amount: 100,
      type: "EXPENSE",
      date: "2026-04-29",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid transaction type", () => {
    const result = TransactionSchema.safeParse({
      categoryId: validUUID,
      amount: 100,
      type: "TRANSFER",
      date: "2026-04-29",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing date", () => {
    const result = TransactionSchema.safeParse({
      categoryId: validUUID,
      amount: 100,
      type: "EXPENSE",
      date: "",
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// BudgetSchema
// ---------------------------------------------------------------------------
describe("BudgetSchema", () => {
  const validUUID = "123e4567-e89b-12d3-a456-426614174000";

  it("accepts valid budget", () => {
    const result = BudgetSchema.safeParse({
      categoryId: validUUID,
      amountLimit: 1000,
      periodStart: "2026-04-01",
      periodEnd: "2026-04-30",
      alertThreshold: 80,
    });
    expect(result.success).toBe(true);
  });

  it("accepts string amountLimit via coerce", () => {
    const result = BudgetSchema.safeParse({
      categoryId: validUUID,
      amountLimit: "500",
      periodStart: "2026-04-01",
      periodEnd: "2026-04-30",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amountLimit).toBe(500);
    }
  });

  it("rejects non-positive amountLimit", () => {
    const result = BudgetSchema.safeParse({
      categoryId: validUUID,
      amountLimit: 0,
      periodStart: "2026-04-01",
      periodEnd: "2026-04-30",
    });
    expect(result.success).toBe(false);
  });

  it("rejects alertThreshold above 100", () => {
    const result = BudgetSchema.safeParse({
      categoryId: validUUID,
      amountLimit: 500,
      periodStart: "2026-04-01",
      periodEnd: "2026-04-30",
      alertThreshold: 110,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-UUID categoryId", () => {
    const result = BudgetSchema.safeParse({
      categoryId: "bad-id",
      amountLimit: 500,
      periodStart: "2026-04-01",
      periodEnd: "2026-04-30",
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// CategorySchema
// ---------------------------------------------------------------------------
describe("CategorySchema", () => {
  it("accepts valid EXPENSE category", () => {
    const result = CategorySchema.safeParse({
      name: "Jedzenie",
      type: "EXPENSE",
      icon: "🍕",
      color: "#ef4444",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid INCOME category", () => {
    const result = CategorySchema.safeParse({ name: "Wynagrodzenie", type: "INCOME" });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = CategorySchema.safeParse({ name: "", type: "EXPENSE" });
    expect(result.success).toBe(false);
  });

  it("rejects name exceeding 100 characters", () => {
    const result = CategorySchema.safeParse({ name: "a".repeat(101), type: "EXPENSE" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid type", () => {
    const result = CategorySchema.safeParse({ name: "Test", type: "TRANSFER" });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// SavingsGoalSchema
// ---------------------------------------------------------------------------
describe("SavingsGoalSchema", () => {
  it("accepts valid savings goal", () => {
    const result = SavingsGoalSchema.safeParse({
      name: "Wakacje",
      targetAmount: 5000,
      deadline: "2026-12-31",
      icon: "🌴",
    });
    expect(result.success).toBe(true);
  });

  it("accepts goal without deadline", () => {
    const result = SavingsGoalSchema.safeParse({
      name: "Samochód",
      targetAmount: 30000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = SavingsGoalSchema.safeParse({ name: "", targetAmount: 1000 });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive targetAmount", () => {
    const result = SavingsGoalSchema.safeParse({ name: "Test", targetAmount: -100 });
    expect(result.success).toBe(false);
  });

  it("rejects zero targetAmount", () => {
    const result = SavingsGoalSchema.safeParse({ name: "Test", targetAmount: 0 });
    expect(result.success).toBe(false);
  });

  it("coerces string targetAmount", () => {
    const result = SavingsGoalSchema.safeParse({ name: "Test", targetAmount: "2500" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.targetAmount).toBe(2500);
    }
  });
});

// ---------------------------------------------------------------------------
// PasswordSchema
// ---------------------------------------------------------------------------
describe("PasswordSchema", () => {
  it("accepts valid password change", () => {
    const result = PasswordSchema.safeParse({
      currentPassword: "oldpass",
      newPassword: "newpassword123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects newPassword shorter than 8 characters", () => {
    const result = PasswordSchema.safeParse({
      currentPassword: "oldpass",
      newPassword: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty currentPassword", () => {
    const result = PasswordSchema.safeParse({
      currentPassword: "",
      newPassword: "newpassword123",
    });
    expect(result.success).toBe(false);
  });
});
