# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> System Zamówień - Testy E2E >> administrator powinien ręcznie dodać zamówienie w panelu
- Location: tests\booking.spec.ts:48:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('table.hidden-mobile').getByText('Nowak-1780754168899')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('table.hidden-mobile').getByText('Nowak-1780754168899')

```

```yaml
- complementary "Nawigacja główna":
  - text: Nocny Promil Całodobowy Dowóz Alkoholu
  - navigation:
    - link "Dashboard":
      - /url: /panel
    - link "Rezerwacje":
      - /url: /panel/rezerwacje
    - link "Usługi":
      - /url: /panel/uslugi
    - link "Klienci":
      - /url: /panel/klienci
    - link "Ustawienia":
      - /url: /panel/ustawienia
  - button "Tryb jasny"
  - link "← Strona główna":
    - /url: /
- main:
  - heading "Rezerwacje" [level=1]
  - paragraph: Zarządzaj wszystkimi wizytami (1)
  - button "Tabela"
  - button "Grafik"
  - button "Eksport"
  - button "Odśwież"
  - button "Dodaj rezerwację"
  - searchbox "Szukaj klienta, usługi..."
  - button "Wszystkie"
  - button "Oczekująca"
  - button "Potwierdzona"
  - button "Zakończona"
  - button "Anulowana"
  - table:
    - rowgroup:
      - row "Klient Usługa Data i godzina Kwota Status Akcje":
        - columnheader "Klient"
        - columnheader "Usługa"
        - columnheader "Data i godzina"
        - columnheader "Kwota"
        - columnheader "Status"
        - columnheader "Akcje"
    - rowgroup:
      - row "AN Anna Nowak-1780754112960 601234567 Piwo rzemieślnicze (6-pak) 20.06.2026 22:30 45 zł Oczekująca Podgląd Edytuj Potwierdź Anuluj":
        - cell "AN Anna Nowak-1780754112960 601234567"
        - cell "Piwo rzemieślnicze (6-pak)"
        - cell "20.06.2026 22:30"
        - cell "45 zł"
        - cell "Oczekująca"
        - cell "Podgląd Edytuj Potwierdź Anuluj":
          - button "Podgląd"
          - button "Edytuj"
          - button "Potwierdź"
          - button "Anuluj"
  - dialog "Nowa rezerwacja":
    - heading "Nowa rezerwacja" [level=2]
    - button "Zamknij"
    - text: Imię klienta
    - textbox: Anna
    - text: Nazwisko klienta
    - textbox: Nowak-1780754168899
    - text: Email
    - textbox: anna.nowak@example.com
    - text: Telefon
    - textbox: "601234567"
    - text: Usługa
    - combobox:
      - option "Wódka Wyborowa 0.5l (30 min) — 50 zł"
      - option "Piwo rzemieślnicze (6-pak) (30 min) — 45 zł" [selected]
      - option "Wino Czerwone Wytrawne (30 min) — 70 zł"
      - option "Whisky Jack Daniels 0.7l (30 min) — 120 zł"
      - option "Zestaw Przekąsek (Chipsy + Paluszki) (15 min) — 25 zł"
    - text: Data
    - textbox: 2026-06-20
    - text: Godzina
    - textbox: 22:30
    - text: Uwagi do wizyty
    - textbox: Ręczne zamówienie E2E
    - button "Anuluj"
    - button "Zapisz wizytę"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('System Zamówień - Testy E2E', () => {
  4  | 
  5  |   test('powinien przejść pełną ścieżkę klienta i złożyć zamówienie', async ({ page }) => {
  6  |     // 1. Wejdź na stronę główną rezerwacji
  7  |     await page.goto('/rezerwacja');
  8  |     await expect(page).toHaveTitle(/Nocny Promil/);
  9  | 
  10 |     // Krok 1: Wybór usługi
  11 |     const wodka = page.locator('button:has-text("Wódka Wyborowa")');
  12 |     await expect(wodka).toBeVisible();
  13 |     await wodka.click();
  14 | 
  15 |     // Krok 2: Wybór daty i godziny
  16 |     // Czekamy na załadowanie kalendarza i klikamy pierwszy dostępny (niezablokowany) dzień
  17 |     const activeDay = page.locator('button[role="gridcell"]:not([disabled])').first();
  18 |     await expect(activeDay).toBeVisible();
  19 |     await activeDay.click();
  20 | 
  21 |     // Klikamy pierwszy wolny slot godzinowy
  22 |     const activeSlot = page.locator('button:has-text(":")').first();
  23 |     await expect(activeSlot).toBeVisible();
  24 |     await activeSlot.click();
  25 | 
  26 |     // Krok 3: Formularz kontaktowy
  27 |     await page.fill('#contact-firstName', 'Jan');
  28 |     await page.fill('#contact-lastName', 'Kowalski');
  29 |     await page.fill('#contact-email', 'jan.kowalski@example.com');
  30 |     await page.fill('#contact-phone', '501234567');
  31 |     await page.fill('#contact-notes', 'Test automatyczny E2E');
  32 |     
  33 |     // Klikamy Dalej
  34 |     await page.click('button:has-text("Przejdź do podsumowania")');
  35 | 
  36 |     // Krok 4: Podsumowanie
  37 |     await expect(page.locator('text=Jan Kowalski')).toBeVisible();
  38 |     await expect(page.locator('text=jan.kowalski@example.com')).toBeVisible();
  39 |     await expect(page.locator('text=Wódka Wyborowa 0.5l').first()).toBeVisible();
  40 | 
  41 |     // Potwierdź rezerwację
  42 |     await page.click('#confirm-booking');
  43 | 
  44 |     // Krok 5: Potwierdzenie
  45 |     await expect(page.locator('text=Wizyta zarezerwowana!')).toBeVisible();
  46 |   });
  47 | 
  48 |   test('administrator powinien ręcznie dodać zamówienie w panelu', async ({ page }) => {
  49 |     // 1. Wejdź do panelu rezerwacji
  50 |     await page.goto('/panel/rezerwacje');
  51 | 
  52 |     // Kliknij przycisk "Dodaj rezerwację"
  53 |     const addBtn = page.locator('#add-booking-btn');
  54 |     await expect(addBtn).toBeVisible();
  55 |     await addBtn.click();
  56 | 
  57 |     // Wypełnij formularz w modalu
  58 |     const uniqueLastName = `Nowak-${Date.now()}`;
  59 |     await page.fill('#create-firstName', 'Anna');
  60 |     await page.fill('#create-lastName', uniqueLastName);
  61 |     await page.fill('#create-email', 'anna.nowak@example.com');
  62 |     await page.fill('#create-phone', '601234567');
  63 |     
  64 |     // Wybierz usługę z selecta
  65 |     await page.selectOption('#create-serviceId', 'svc-002'); // Piwo rzemieślnicze
  66 | 
  67 |     // Wpisz przyszłą datę (np. za 2 tygodnie) i rzadszą godzinę, aby uniknąć kolizji
  68 |     const futureDate = new Date();
  69 |     futureDate.setDate(futureDate.getDate() + 14);
  70 |     const dateStr = futureDate.toISOString().split('T')[0];
  71 |     
  72 |     await page.fill('#create-date', dateStr);
  73 |     await page.fill('#create-time', '22:30');
  74 |     await page.fill('#create-notes', 'Ręczne zamówienie E2E');
  75 | 
  76 |     // Kliknij zapisz
  77 |     await page.click('#submit-create-booking');
  78 | 
  79 |     // Sprawdź czy nowo dodany klient jest widoczny w tabeli rezerwacji (celujemy w tabelę desktopową)
  80 |     const table = page.locator('table.hidden-mobile');
> 81 |     await expect(table.getByText(uniqueLastName)).toBeVisible();
     |                                                   ^ Error: expect(locator).toBeVisible() failed
  82 |     await expect(table.getByText('Piwo rzemieślnicze').first()).toBeVisible();
  83 |   });
  84 | });
  85 | 
  86 | 
```