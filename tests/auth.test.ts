import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword, signToken, verifyToken } from "../lib/auth";

// ---------------------------------------------------------------------------
// hashPassword / comparePassword
// ---------------------------------------------------------------------------
describe("hashPassword", () => {
  it("returns a bcrypt hash (starts with $2b$)", async () => {
    const hash = await hashPassword("mypassword");
    expect(hash).toMatch(/^\$2[ab]\$/);
  });

  it("produces different hashes for the same password (salt randomisation)", async () => {
    const hash1 = await hashPassword("samepassword");
    const hash2 = await hashPassword("samepassword");
    expect(hash1).not.toBe(hash2);
  });
});

describe("comparePassword", () => {
  it("returns true for correct password", async () => {
    const hash = await hashPassword("correctpassword");
    const result = await comparePassword("correctpassword", hash);
    expect(result).toBe(true);
  });

  it("returns false for wrong password", async () => {
    const hash = await hashPassword("correctpassword");
    const result = await comparePassword("wrongpassword", hash);
    expect(result).toBe(false);
  });

  it("returns false for empty string against real hash", async () => {
    const hash = await hashPassword("somepassword");
    const result = await comparePassword("", hash);
    expect(result).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// signToken / verifyToken
// ---------------------------------------------------------------------------
describe("signToken / verifyToken", () => {
  it("signs and verifies a token with userId payload", () => {
    const payload = { userId: "user-123", email: "test@example.com" };
    const token = signToken(payload);

    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3); // JWT has 3 parts

    const decoded = verifyToken(token);
    expect(decoded.userId).toBe("user-123");
    expect(decoded.email).toBe("test@example.com");
  });

  it("throws on tampered token", () => {
    const token = signToken({ userId: "user-abc" });
    const [header, payload] = token.split(".");
    const tamperedToken = `${header}.${payload}.invalidsignature`;

    expect(() => verifyToken(tamperedToken)).toThrow();
  });

  it("throws on completely invalid token", () => {
    expect(() => verifyToken("not.a.token")).toThrow();
  });

  it("throws on empty string", () => {
    expect(() => verifyToken("")).toThrow();
  });
});
