import { test, expect } from '@playwright/test'
import { disconnect, login, resetDatabase, seedDoctor } from './helpers'

test.describe('Endpoint público de médicos', () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test.afterAll(async () => {
    await disconnect()
  })

  test('GET /api/doctors lista médicos em ordem de displayOrder', async ({ request }) => {
    await seedDoctor({ name: 'Dr. Segundo', crm: 'CRM 2', areas: ['Retina'], displayOrder: 2 })
    await seedDoctor({ name: 'Dr. Primeiro', crm: 'CRM 1', areas: ['Catarata'], displayOrder: 1 })
    const res = await request.get('/api/doctors')
    expect(res.ok()).toBeTruthy()
    const { doctors } = await res.json()
    expect(doctors).toHaveLength(2)
    expect(doctors[0].name).toBe('Dr. Primeiro')
    expect(doctors[1].name).toBe('Dr. Segundo')
  })

  test('página home renderiza médicos após mutation no admin', async ({ page }) => {
    await login(page)
    await page.goto('/admin/medicos/novo')
    await page.getByLabel('Nome completo').fill('Dra. Pública do Teste')
    await page.getByLabel('CRM').fill('CRM/MG 77.777')
    await page.getByLabel('Especialidades').fill('Plástica Ocular')
    await page.getByRole('button', { name: /cadastrar médico/i }).click()
    await expect(page).toHaveURL(/\/admin\/medicos$/)

    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Corpo Clínico' })).toBeVisible()
    await expect(page.getByText('Dra. Pública do Teste')).toBeVisible({ timeout: 10_000 })
  })
})
