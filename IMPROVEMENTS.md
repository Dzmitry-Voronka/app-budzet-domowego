# Lista ulepszeń — Budżet Domowy

Poniżej zestawiono wszystkie ulepszenia wprowadzone w projekcie w ramach kolejnych sprintów.

---

## Sprint 4

### 1. Walidacja po stronie klienta (react-hook-form + Zod)

**Przed:** Formularze używały ręcznych sprawdzeń `if (!field)` — błędy wyświetlały się jako jeden ogólny komunikat na górze formularza, brak walidacji przed wysłaniem żądania HTTP.

**Po:** Wszystkie formularze korzystają z `react-hook-form` z `zodResolver`:
- Błędy wyświetlają się **inline pod każdym polem** natychmiast po utracie fokusu lub próbie wysłania
- Formularz jest **blokowany** do czasu poprawnego wypełnienia — nie wysyła żadnych żądań HTTP przy błędnych danych
- Obsłużone formularze: Login, Rejestracja, Dodawanie transakcji, Nowy budżet, Nowa/edytowana kategoria, Nowy cel oszczędnościowy

### 2. Współdzielone schematy Zod (`lib/validations.ts`)

**Przed:** Każda trasa API definiowała własny schemat Zod inline — duplikacja kodu, niemożność reużycia na kliencie.

**Po:** Centralny plik `lib/validations.ts` eksportuje wszystkie schematy i ich typy TypeScript:
- `LoginSchema`, `RegisterBaseSchema`, `RegisterSchema`
- `TransactionSchema`, `BudgetSchema`, `CategorySchema`, `SavingsGoalSchema`
- `PasswordSchema`, `ProfileSchema`
- Trasy API importują schematy z tego pliku — **jeden schemat, dwa miejsca użycia** (serwer i klient)

### 3. Testy jednostkowe (Vitest)

**Przed:** Brak jakichkolwiek testów automatycznych.

**Po:** 45 testów w 2 plikach:
- `tests/validations.test.ts` — 36 testów sprawdzających każdy schemat Zod (poprawne dane, brakujące pola, błędne formaty, wartości graniczne)
- `tests/auth.test.ts` — 9 testów weryfikujących `hashPassword`, `comparePassword`, `signToken`, `verifyToken`
- Uruchomienie: `npm test`

### 4. Poprawa typowania TypeScript

**Przed:** Kilka miejsc używało `catch (err: any)` — naruszenie reguły ESLint `no-explicit-any`.

**Po:** Zmieniono na `catch (err: unknown)` z odpowiednim rzutowaniem typów w blokach catch. Zaktualizowano `@hookform/resolvers` do v3.x (prawidłowe pole `types` w `package.json exports`, zgodne z `moduleResolution: "bundler"`).

---

## Sprint 3 (wcześniej wprowadzone)

### 5. System logowania i autoryzacji (JWT + HTTP-only cookies)

- Tokeny JWT podpisane algorytmem HS256 z sekretem z zmiennej środowiskowej
- Token przechowywany w **HTTP-only cookie** (`Secure`, `SameSite: lax`) — odporny na ataki XSS
- Fallback do nagłówka `Authorization: Bearer` dla klientów API
- Middleware `requireAuth()` reużywany przez wszystkie chronione trasy
- Endpoint `POST /api/auth/logout` usuwa cookie (zerowy `maxAge`)

### 6. Walidacja po stronie serwera (Zod na wszystkich endpoint-ach)

- Każdy endpoint API ma schemat Zod dla danych wejściowych
- Ustandaryzowany format odpowiedzi błędu: `{ success: false, error: { code, issues } }`
- Kody błędów: `VALIDATION_ERROR`, `UNAUTHORIZED`, `NOT_FOUND`, `SERVER_ERROR`, `INVALID_CREDENTIALS`, `USER_EXISTS`, `WRONG_PASSWORD`

### 7. Ustandaryzowany format odpowiedzi API

Wszystkie odpowiedzi API zwracają:
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "code": "...", "issues": [...] } }
```
Z właściwymi kodami HTTP: 200/201 sukces, 400 błąd danych, 401 brak autoryzacji, 404 nie znaleziono, 500 błąd serwera.

### 8. Paginacja transakcji

Endpoint `GET /api/transactions` obsługuje parametry:
- `page`, `limit` — paginacja
- `type`, `categoryId`, `dateFrom`, `dateTo` — filtrowanie
- `sortBy`, `order` — sortowanie

Odpowiedź zawiera `meta: { total, page, lastPage, limit }`.

### 9. Hashowanie haseł (bcrypt)

Hasła nigdy nie są przechowywane w postaci jawnej — używany `bcryptjs` z `saltRounds: 10`.

### 10. Bezpieczeństwo danych użytkownika

- Wszystkie zapytania Prisma filtrują po `userId` — użytkownik nie ma dostępu do danych innych użytkowników
- Operacje `DELETE`/`UPDATE` używają `deleteMany`/`updateMany` z warunkiem `{ id, userId }` — niemożliwe przejęcie cudzego rekordu przez podanie jego ID
- Brak ujawniania `passwordHash` w odpowiedziach API

---

## Sprint 1–2 (wcześniej wprowadzone)

### 11. Struktura Next.js App Router

- Podział na publiczne (`/login`, `/register`) i chronione (`/(app)/*`) segmenty trasy
- Server Components do pobierania danych z bazy, Client Components do interaktywności
- Brak zbędnych żądań client-side dzięki `page.tsx` jako Server Component

### 12. ORM Prisma z PostgreSQL

- Silnie typowane zapytania do bazy danych
- Migracje wersjonowane w katalogu `prisma/migrations/`
- Relacje: `User → Transaction`, `User → Budget`, `User → Category`, `User → SavingsGoal`

### 13. Dashboard z wykresami

- Wykres przychodów i wydatków (`IncomeExpensesChart` — Recharts)
- Wykres rozkładu przychodów (`RevenueChart`)
- Podsumowanie statystyk bieżącego miesiąca

### 14. Cele oszczędnościowe

- Śledzenie postępu (pasek procentowy)
- Wpłaty i wypłaty środków przez modal
- Anulowanie celu (soft-delete przez zmianę statusu na `ARCHIVED`)
