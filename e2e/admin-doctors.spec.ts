import { test, expect } from '@playwright/test'
import { disconnect, login, resetDatabase, seedDoctor } from './helpers'

test.describe('Admin — CRUD de médicos', () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test.afterAll(async () => {
    await disconnect()
  })

  test('lista vazia mostra call-to-action', async ({ page }) => {
    await login(page)
    await expect(page.getByText(/nenhum médico cadastrado/i)).toBeVisible()
  })

  test('cadastra, edita e remove um médico', async ({ page }) => {
    await login(page)

    await page.getByRole('link', { name: /novo médico/i }).click()
    await expect(page).toHaveURL(/\/admin\/medicos\/novo/)

    await page.getByLabel('Nome completo').fill('Dr. Teste E2E')
    await page.getByLabel('CRM').fill('CRM/MG 99.999')
    await page.getByLabel('RQE (opcional)').fill('RQE 99999')
    await page.getByLabel('Especialidades').fill('Catarata, Retina')
    await page.getByLabel('Ordem de exibição').fill('10')
    await page.getByRole('button', { name: /cadastrar médico/i }).click()

    await expect(page).toHaveURL(/\/admin\/medicos$/)
    await expect(page.getByText('Dr. Teste E2E')).toBeVisible()

    await page.getByRole('link', { name: /editar/i }).first().click()
    await expect(page).toHaveURL(/\/admin\/medicos\/[a-z0-9]+$/i)
    await page.getByLabel('Nome completo').fill('Dr. Teste E2E — Atualizado')
    await page.getByRole('button', { name: /salvar alterações/i }).click()

    await expect(page).toHaveURL(/\/admin\/medicos$/)
    await expect(page.getByText('Dr. Teste E2E — Atualizado')).toBeVisible()

    page.once('dialog', (d) => d.accept())
    await page.getByRole('button', { name: /remover/i }).first().click()
    await expect(page.getByText('Dr. Teste E2E — Atualizado')).toBeHidden()
  })

  test('valida nome muito curto', async ({ page }) => {
    await login(page)
    await page.goto('/admin/medicos/novo')
    await page.getByLabel('Nome completo').fill('ab')
    await page.getByLabel('CRM').fill('CRM/MG 111')
    await page.getByLabel('Especialidades').fill('Catarata')
    await page.getByRole('button', { name: /cadastrar médico/i }).click()
    await expect(page).toHaveURL(/\/admin\/medicos\/novo$/)
  })

  test('edição de médico existente preserva campos', async ({ page }) => {
    const doc = await seedDoctor({
      name: 'Dra. Existente',
      crm: 'CRM/MG 50.000',
      rqe: 'RQE 50000',
      areas: ['Glaucoma'],
      displayOrder: 3,
    })
    await login(page)
    await page.goto(`/admin/medicos/${doc.id}`)
    await expect(page.getByLabel('Nome completo')).toHaveValue('Dra. Existente')
    await expect(page.getByLabel('CRM')).toHaveValue('CRM/MG 50.000')
    await expect(page.getByLabel('Especialidades')).toHaveValue('Glaucoma')
  })
})
