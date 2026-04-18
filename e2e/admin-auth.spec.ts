import { test, expect } from '@playwright/test'
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  disconnect,
  login,
  resetDatabase,
} from './helpers'

test.describe('Admin auth', () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test.afterAll(async () => {
    await disconnect()
  })

  test('redireciona deslogado de /admin/medicos pra login', async ({ page }) => {
    const res = await page.goto('/admin/medicos')
    await expect(page).toHaveURL(/\/admin\/login/)
    expect(res?.ok()).toBeTruthy()
  })

  test('bloqueia credenciais inválidas', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel('Usuário').fill(ADMIN_USERNAME)
    await page.getByLabel('Senha').fill('errado')
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page.getByRole('alert')).toContainText(/incorret/i)
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('login válido leva pra /admin/medicos e logout volta pro login', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel('Usuário').fill(ADMIN_USERNAME)
    await page.getByLabel('Senha').fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page).toHaveURL(/\/admin\/medicos/)
    await expect(page.getByRole('heading', { name: 'Médicos' })).toBeVisible()

    await page.getByRole('button', { name: /sair/i }).click()
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('API admin sem sessão retorna 401', async ({ request }) => {
    const res = await request.get('/api/admin/doctors')
    expect(res.status()).toBe(401)
  })

  test('API admin autenticada retorna lista', async ({ page, request }) => {
    await login(page)
    const res = await request.get('/api/admin/doctors')
    expect(res.ok()).toBeTruthy()
    const json = await res.json()
    expect(Array.isArray(json.doctors)).toBeTruthy()
  })
})
