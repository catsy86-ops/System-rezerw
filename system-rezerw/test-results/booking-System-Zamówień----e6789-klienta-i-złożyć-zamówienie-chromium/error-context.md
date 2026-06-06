# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> System Zamówień - Testy E2E >> powinien przejść pełną ścieżkę klienta i złożyć zamówienie
- Location: tests\booking.spec.ts:5:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button:has-text(":")').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('button:has-text(":")').first()

```

```yaml
- banner:
  - link "Nocny Promil":
    - /url: /
  - button "Wstecz"
- text: 2 3 4 Krok 2 z 4
- heading "Wybierz idealny moment" [level=1]
- paragraph: Nasz kalendarz jest zawsze aktualny. Wybierz termin, który Ci pasuje.
- text: 🧊 Wódka Wyborowa 0.5l 30 min 50 zł Wybrano
- heading "Wybierz datę wizyty" [level=3]
- button "Poprzedni miesiąc"
- text: Czerwiec 2026
- button "Następny miesiąc"
- text: Pn Wt Śr Cz Pt So Nd
- gridcell "Dzień 1, Czerwiec 2026" [disabled]: "1"
- gridcell "Dzień 2, Czerwiec 2026" [disabled]: "2"
- gridcell "Dzień 3, Czerwiec 2026" [disabled]: "3"
- gridcell "Dzień 4, Czerwiec 2026" [disabled]: "4"
- gridcell "Dzień 5, Czerwiec 2026" [disabled]: "5"
- gridcell "Dzień 6, Czerwiec 2026" [selected]: "6"
- gridcell "Dzień 7, Czerwiec 2026": "7"
- gridcell "Dzień 8, Czerwiec 2026": "8"
- gridcell "Dzień 9, Czerwiec 2026": "9"
- gridcell "Dzień 10, Czerwiec 2026": "10"
- gridcell "Dzień 11, Czerwiec 2026": "11"
- gridcell "Dzień 12, Czerwiec 2026": "12"
- gridcell "Dzień 13, Czerwiec 2026": "13"
- gridcell "Dzień 14, Czerwiec 2026": "14"
- gridcell "Dzień 15, Czerwiec 2026": "15"
- gridcell "Dzień 16, Czerwiec 2026": "16"
- gridcell "Dzień 17, Czerwiec 2026": "17"
- gridcell "Dzień 18, Czerwiec 2026": "18"
- gridcell "Dzień 19, Czerwiec 2026": "19"
- gridcell "Dzień 20, Czerwiec 2026": "20"
- gridcell "Dzień 21, Czerwiec 2026": "21"
- gridcell "Dzień 22, Czerwiec 2026": "22"
- gridcell "Dzień 23, Czerwiec 2026": "23"
- gridcell "Dzień 24, Czerwiec 2026": "24"
- gridcell "Dzień 25, Czerwiec 2026": "25"
- gridcell "Dzień 26, Czerwiec 2026": "26"
- gridcell "Dzień 27, Czerwiec 2026": "27"
- gridcell "Dzień 28, Czerwiec 2026": "28"
- gridcell "Dzień 29, Czerwiec 2026": "29"
- gridcell "Dzień 30, Czerwiec 2026": "30"
- heading "Wybierz godzinę" [level=3]
- text: Sobota, 6 Czerwiec 2026 Wybrany Zajęty
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
> 23 |     await expect(activeSlot).toBeVisible();
     |                              ^ Error: expect(locator).toBeVisible() failed
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
  81 |     await expect(table.getByText(uniqueLastName)).toBeVisible();
  82 |     await expect(table.getByText('Piwo rzemieślnicze').first()).toBeVisible();
  83 |   });
  84 | });
  85 | 
  86 | 
```