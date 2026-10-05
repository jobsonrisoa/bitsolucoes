import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await expect(page).toHaveTitle(/Átrio/i);
    await expect(page.locator('h2')).toContainText('Entrar');
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="username"]', 'ana');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/painel');
    await expect(page.locator('h1')).toContainText('Painel');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="username"]', 'ana');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Usuário ou senha inválidos')).toBeVisible();
  });

  test('should redirect to login when accessing protected routes without auth', async ({ page }) => {
    await page.goto('http://localhost:3000/painel');
    await page.waitForURL('**/login');
    await expect(page.locator('h2')).toContainText('Entrar');
  });
});

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'ana');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/painel');
  });

  test('should display dashboard with statistics', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Painel');
    
    // Check for stat cards
    const statCards = page.locator('[data-testid="stat-card"]');
    await expect(statCards.first()).toBeVisible();
  });

  test('should display total, open, in progress, and completed counts', async ({ page }) => {
    const stats = page.locator('[data-testid="stat-card"]');
    await expect(stats).toHaveCount(4);
  });

  test('should navigate to requests list', async ({ page }) => {
    await page.click('text=Ver lista');
    await page.waitForURL('**/lista');
    await expect(page.locator('h1')).toContainText('Solicitações');
  });

  test('should navigate to new request form', async ({ page }) => {
    await page.click('text=Nova solicitação');
    await page.waitForURL('**/lista/nova');
    await expect(page.locator('h1')).toContainText('Nova Solicitação');
  });
});

test.describe('Requests List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'ana');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/painel');
    await page.click('text=Ver lista');
    await page.waitForURL('**/lista');
  });

  test('should display requests list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Solicitações');
    await expect(page.locator('text=Nova Solicitação')).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    await page.click('button:has-text("TI")');
    await page.waitForTimeout(500); // Wait for filter to apply
    // Check that filter is active
    const activeButton = page.locator('button[aria-pressed="true"]');
    await expect(activeButton).toContainText('TI');
  });

  test('should search by title', async ({ page }) => {
    await page.fill('input[name="search"]', 'computer');
    await page.waitForTimeout(500); // Wait for search to apply
    // Search input should have the value
    await expect(page.locator('input[name="search"]')).toHaveValue('computer');
  });

  test('should navigate to new request form', async ({ page }) => {
    await page.click('text=Nova Solicitação');
    await page.waitForURL('**/lista/nova');
    await expect(page.locator('h1')).toContainText('Nova Solicitação');
  });
});

test.describe('Create Request', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'ana');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/painel');
  });

  test('should create a new request', async ({ page }) => {
    await page.click('text=Nova solicitação');
    await page.waitForURL('**/lista/nova');

    await page.fill('input[name="title"]', 'Test Request from E2E');
    await page.fill('textarea[name="description"]', 'This is a test request created by E2E tests');
    await page.selectOption('select[name="category"]', 'TI');
    
    await page.click('button[type="submit"]');
    
    // Should redirect to list after successful creation
    await page.waitForURL('**/lista', { timeout: 5000 });
    await expect(page.locator('h1')).toContainText('Solicitações');
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('text=Nova solicitação');
    await page.waitForURL('**/lista/nova');

    // Try to submit without filling fields
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=obrigat')).toBeVisible({ timeout: 2000 });
  });
});

test.describe('Logout', () => {
  test('should logout successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'ana');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/painel');

    // Click logout (assuming there's a logout button in the header)
    const logoutButton = page.locator('text=Sair').or(page.locator('button[aria-label="Logout"]'));
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForURL('**/login');
      await expect(page.locator('h2')).toContainText('Entrar');
    }
  });
});
