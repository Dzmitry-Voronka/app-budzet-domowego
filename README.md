This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Testy

### Testy automatyczne (Vitest)

Projekt zawiera testy jednostkowe uruchamiane przez **Vitest**. Aby je wykonać:

```bash
npm test
```

#### Co zostało sprawdzone automatycznie

**`tests/validations.test.ts`** — walidacja schematów Zod (36 testów):

| Schema | Sprawdzone przypadki |
|--------|----------------------|
| `LoginSchema` | poprawne dane, brak emaila, błędny format email, brak hasła |
| `RegisterBaseSchema` | poprawne dane, hasło < 8 znaków, pusta nazwa, błędny email |
| `RegisterSchema` | zgodne hasła, niezgodne hasła (błąd wskazuje pole `confirmPassword`) |
| `TransactionSchema` | EXPENSE/INCOME, koercja string→number, ujemna kwota, zero, zły UUID, nieznany typ, brak daty |
| `BudgetSchema` | poprawne dane, koercja limitu, limit ≤ 0, `alertThreshold` > 100, zły UUID |
| `CategorySchema` | EXPENSE/INCOME, pusta nazwa, nazwa > 100 znaków, nieprawidłowy typ |
| `SavingsGoalSchema` | z terminem / bez terminu, pusta nazwa, ujemna kwota, zero, koercja kwoty |
| `PasswordSchema` | poprawna zmiana, nowe hasło < 8 znaków, puste aktualne hasło |

**`tests/auth.test.ts`** — funkcje autoryzacji (9 testów):

| Funkcja | Sprawdzone przypadki |
|---------|----------------------|
| `hashPassword` | zwraca hash bcrypt (`$2b$`), różne hashe dla tego samego hasła (sól) |
| `comparePassword` | sukces przy prawidłowym haśle, niepowodzenie przy złym, niepowodzenie dla pustego stringa |
| `signToken` / `verifyToken` | podpisanie i weryfikacja tokena JWT, wyjątek dla zmodyfikowanego tokena, zupełnie błędnego tokena, pustego stringa |

---

### Testowanie manualne

Poniżej opisano scenariusze, które zostały sprawdzone ręcznie w przeglądarce:

#### Autoryzacja

| Scenariusz | Oczekiwany wynik |
|------------|-----------------|
| Rejestracja z prawidłowymi danymi | Konto tworzone, przekierowanie do dashboardu |
| Rejestracja z istniejącym emailem | Komunikat „Użytkownik o tym adresie email już istnieje" |
| Rejestracja z hasłem < 8 znaków | Błąd inline pod polem hasła przed wysłaniem formularza |
| Rejestracja z niezgodnymi hasłami | Błąd inline pod polem „Potwierdź hasło" |
| Logowanie z prawidłowymi danymi | Przekierowanie do dashboardu, cookie `token` ustawione |
| Logowanie z błędnym hasłem | Komunikat „Nieprawidłowy email lub hasło" |
| Dostęp do `/dashboard` bez tokena | Przekierowanie do `/login` |

#### Transakcje

| Scenariusz | Oczekiwany wynik |
|------------|-----------------|
| Dodanie transakcji z poprawnymi danymi | Transakcja pojawia się na liście |
| Wysłanie formularza z pustymi polami | Walidacja client-side blokuje wysyłanie (błędy inline) |
| Podanie kwoty 0 lub ujemnej | Błąd „Kwota musi być większa od 0" |
| UUID kategorii w złym formacie | Błąd walidacji Zod (400) z serwera |
| Filtrowanie po dacie i kategorii | Lista zawęża się do pasujących rekordów |

#### Budżety

| Scenariusz | Oczekiwany wynik |
|------------|-----------------|
| Dodanie budżetu bez wybrania kategorii | Błąd inline „Wybierz kategorię" |
| Dodanie budżetu z limitem 0 | Błąd „Limit musi być większy od 0" |
| Przekroczenie limitu przez transakcje | Pasek postępu zmienia kolor na czerwony, ikona `AlertTriangle` |
| Usunięcie budżetu | Budżet znika z listy natychmiast |

#### Kategorie i Cele oszczędnościowe

| Scenariusz | Oczekiwany wynik |
|------------|-----------------|
| Dodanie kategorii bez nazwy | Błąd „Nazwa jest wymagana" |
| Edycja kategorii | Formularz wypełnia się aktualnymi danymi |
| Stworzenie celu z ujemną kwotą | Błąd „Kwota docelowa musi być większa od 0" |
| Wpłata środków na cel | Pasek postępu aktualizuje się w czasie rzeczywistym |

#### API (Postman / curl)

| Endpoint | Sprawdzone przypadki |
|----------|----------------------|
| `POST /api/auth/login` | 200 + cookie przy dobrych danych; 401 przy złych |
| `POST /api/auth/register` | 201 + cookie; 400 `USER_EXISTS` dla duplikatu |
| `GET /api/transactions` bez tokena | 401 `UNAUTHORIZED` |
| `POST /api/transactions` z brakującymi polami | 400 `VALIDATION_ERROR` z listą `issues` Zod |
| `DELETE /api/transactions/:id` obcego rekordu | 404 `NOT_FOUND` |
