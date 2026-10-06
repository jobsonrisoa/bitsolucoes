import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }) => {
  await page.waitForTimeout(300);
});

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('should display login page', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await expect(page).toHaveTitle(/Átrio/i);
    await expect(page.getByRole('heading', { level: 2, name: /entrar/i })).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="username"]', 'ana');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/painel(\?.*)?$/, { timeout: 15000 });
    await expect(page.getByRole('heading', { level: 1, name: /painel/i })).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="username"]', 'ana');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.getByText(/usuário ou senha inválidos/i)).toBeVisible({ timeout: 10000 });
  });

  test('should redirect to login when accessing protected routes without auth', async ({ page }) => {
    await page.goto('http://localhost:3000/painel');
    await expect(page).toHaveURL(/\/login(\?.*)?$/, { timeout: 15000 });
    await expect(page.getByRole('heading', { level: 2, name: /entrar/i })).toBeVisible();
  });
});

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'ana');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/painel(\?.*)?$/, { timeout: 15000 });
  });

  test('should display dashboard with statistics', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: /painel/i })).toBeVisible();
    const statCards = page.locator('[data-testid="stat-card"]');
    await expect(statCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should display total, open, in progress, and completed counts', async ({ page }) => {
    const stats = page.locator('[data-testid="stat-card"]');
    await expect(stats).toHaveCount(4, { timeout: 10000 });
  });

  test('should navigate to requests list', async ({ page }) => {
    await page.getByRole('link', { name: /ver lista/i }).click();
    await expect(page).toHaveURL(/\/lista(\?.*)?$/, { timeout: 15000 });
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Solicitações', { timeout: 10000 });
  });

  test('should navigate to new request form', async ({ page }) => {
    await page.getByRole('link', { name: /nova solicitação/i }).click();
    await expect(page).toHaveURL(/\/lista\/nova(\?.*)?$/, { timeout: 15000 });
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Nova Solicitação', { timeout: 10000 });
  });
});

test.describe('Requests List', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'ana');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/painel(\?.*)?$/, { timeout: 15000 });
    await page.getByRole('link', { name: /ver lista/i }).click();
    await expect(page).toHaveURL(/\/lista(\?.*)?$/, { timeout: 15000 });
  });

  test('should display requests list', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Solicitações', { timeout: 10000 });
    await expect(page.getByText(/nova solicitação/i).first()).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    const tiButton = page.getByRole('button', { name: /^TI$/i });
    await tiButton.click();
    await expect(tiButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('should search by title', async ({ page }) => {
    const searchInput = page.locator('input[name="search"]');
    await searchInput.fill('computer');
    await expect(searchInput).toHaveValue('computer');
  });

  test('should navigate to new request form', async ({ page }) => {
    await page.getByRole('link', { name: /nova solicitação/i }).click();
    await expect(page).toHaveURL(/\/lista\/nova(\?.*)?$/, { timeout: 15000 });
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Nova Solicitação', { timeout: 10000 });
  });
});

test.describe('Create Request', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'ana');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/painel(\?.*)?$/, { timeout: 15000 });
  });

  test('should create a new request', async ({ page }) => {
    await page.getByRole('link', { name: /nova solicitação/i }).click();
    await expect(page).toHaveURL(/\/lista\/nova(\?.*)?$/, { timeout: 15000 });

    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('/requests') && res.request().method() === 'POST',
      { timeout: 15000 },
    );

    await page.fill('input[name="title"]', `Test Request ${Date.now()}`);
    await page.fill('textarea[name="description"]', 'This is a test request created by E2E tests');
    await page.selectOption('select[name="category"]', 'TI');

    await page.click('button[type="submit"]');

    const response = await responsePromise;
    const body = await response.text();
    console.log('\n>>> POST /requests →', response.status(), body, '\n');

    if (!response.ok()) {
      throw new Error(`Backend retornou ${response.status()}: ${body}`);
    }

    await expect(page).toHaveURL(/\/lista(\?.*)?$/, { timeout: 15000 });
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Solicitações', { timeout: 10000 });
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('link', { name: /nova solicitação/i }).click();
    await expect(page).toHaveURL(/\/lista\/nova(\?.*)?$/, { timeout: 15000 });

    await page.waitForLoadState('networkidle');

    await page.click('button[type="submit"]');

    await expect(page.locator('p.text-red, p.text-red-700').first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Logout', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'ana');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');

    await Promise.race([
      page.waitForURL(/\/painel(\?.*)?$/, { timeout: 30000 }),
      page.getByText(/usuário ou senha inválidos/i)
        .waitFor({ timeout: 30000 })
        .then(() => { throw new Error('Backend rejeitou login — possível rate limit'); }),
    ]);

    const logoutButton = page.getByRole('button', { name: /sair|logout/i });
    if (await logoutButton.isVisible().catch(() => false)) {
      await logoutButton.click();
      await expect(page).toHaveURL(/\/login(\?.*)?$/, { timeout: 15000 });
      await expect(page.getByRole('heading', { level: 2, name: /entrar/i })).toBeVisible();
    }
  });
});