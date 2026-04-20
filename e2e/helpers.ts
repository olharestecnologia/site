import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import type { Page } from '@playwright/test'

export const ADMIN_USERNAME = 'e2e-admin'
export const ADMIN_PASSWORD = 'E2eTesting!234'

const prisma = new PrismaClient()

export async function resetDatabase() {
  await prisma.doctor.deleteMany({})
  await prisma.user.deleteMany({})
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  await prisma.user.create({
    data: { username: ADMIN_USERNAME, passwordHash },
  })
}

export async function seedDoctor(
  data: {
    name: string
    crm: string
    rqe?: string | null
    areas: string[]
    photoUrl?: string | null
    displayOrder?: number
  }
) {
  return prisma.doctor.create({
    data: {
      name: data.name,
      crm: data.crm,
      rqe: data.rqe ?? null,
      photoUrl: data.photoUrl ?? null,
      areas: data.areas,
      displayOrder: data.displayOrder ?? 0,
      allAges: true,
    },
  })
}

export async function login(page: Page) {
  await page.goto('/admin/login')
  await page.getByLabel('Usuário').fill(ADMIN_USERNAME)
  await page.getByLabel('Senha').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: /entrar/i }).click()
  await page.waitForURL(/\/admin\/medicos/)
}

export async function disconnect() {
  await prisma.$disconnect()
}
