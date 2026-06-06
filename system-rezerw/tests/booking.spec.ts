import { test, expect } from '@playwright/test';

test.describe('System Zamówień - Testy E2E', () => {

  test('powinien przejść pełną ścieżkę klienta i złożyć zamówienie', async ({ page }) => {
    // 1. Wejdź na stronę główną rezerwacji
    await page.goto('/rezerwacja');
    await expect(page).toHaveTitle(/Nocny Promil/);

    // Krok 1: Wybór usługi
    const wodka = page.locator('button:has-text("Wódka Wyborowa")');
    await expect(wodka).toBeVisible();
    await wodka.click();

    // Krok 2: Wybór daty i godziny
    // Czekamy na załadowanie kalendarza i klikamy pierwszy dostępny (niezablokowany) dzień
    const activeDay = page.locator('button[role="gridcell"]:not([disabled])').first();
    await expect(activeDay).toBeVisible();
    await activeDay.click();

    // Klikamy pierwszy wolny slot godzinowy
    const activeSlot = page.locator('button:has-text(":")').first();
    await expect(activeSlot).toBeVisible();
    await activeSlot.click();

    // Krok 3: Formularz kontaktowy
    await page.fill('#contact-firstName', 'Jan');
    await page.fill('#contact-lastName', 'Kowalski');
    await page.fill('#contact-email', 'jan.kowalski@example.com');
    await page.fill('#contact-phone', '501234567');
    await page.fill('#contact-notes', 'Test automatyczny E2E');
    
    // Klikamy Dalej
    await page.click('button:has-text("Przejdź do podsumowania")');

    // Krok 4: Podsumowanie
    await expect(page.locator('text=Jan Kowalski')).toBeVisible();
    await expect(page.locator('text=jan.kowalski@example.com')).toBeVisible();
    await expect(page.locator('text=Wódka Wyborowa 0.5l').first()).toBeVisible();

    // Potwierdź rezerwację
    await page.click('#confirm-booking');

    // Krok 5: Potwierdzenie
    await expect(page.locator('text=Wizyta zarezerwowana!')).toBeVisible();
  });

  test('administrator powinien ręcznie dodać zamówienie w panelu', async ({ page }) => {
    // 1. Wejdź do panelu rezerwacji
    await page.goto('/panel/rezerwacje');

    // Kliknij przycisk "Dodaj rezerwację"
    const addBtn = page.locator('#add-booking-btn');
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Wypełnij formularz w modalu
    const uniqueLastName = `Nowak-${Date.now()}`;
    await page.fill('#create-firstName', 'Anna');
    await page.fill('#create-lastName', uniqueLastName);
    await page.fill('#create-email', 'anna.nowak@example.com');
    await page.fill('#create-phone', '601234567');
    
    // Wybierz usługę z selecta
    await page.selectOption('#create-serviceId', 'svc-002'); // Piwo rzemieślnicze

    // Wpisz przyszłą datę (np. za 2 tygodnie) i rzadszą godzinę, aby uniknąć kolizji
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    const dateStr = futureDate.toISOString().split('T')[0];
    
    await page.fill('#create-date', dateStr);
    await page.fill('#create-time', '22:30');
    await page.fill('#create-notes', 'Ręczne zamówienie E2E');

    // Kliknij zapisz
    await page.click('#submit-create-booking');

    // Sprawdź czy nowo dodany klient jest widoczny w tabeli rezerwacji (celujemy w tabelę desktopową)
    const table = page.locator('table.hidden-mobile');
    await expect(table.getByText(uniqueLastName)).toBeVisible();
    await expect(table.getByText('Piwo rzemieślnicze').first()).toBeVisible();
  });
});

