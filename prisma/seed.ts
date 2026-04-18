import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { put } from '@vercel/blob'

const prisma = new PrismaClient()

const DOCTOR_PHOTOS: Record<string, string> = {
  'Dr. Antonio Augusto de Morais Pires': 'dr-antonio.jpg',
  'Dra. Andreia Miriam Lopes Sansoni': 'dra-andreia.jpg',
  'Dr. Alvaro Ribeiro Vaz de Faria': 'dr-alvaro.jpg',
  'Dr. Caio Godinho Caldeira': 'dr-caio.jpg',
  'Dr. Gustavo Gonçalves Rodrigues': 'dr-gustavo.jpg',
  'Dra. Rafaela de Morais Miranda': 'dra-rafaela.jpg',
  'Dr. Raphael Coelho Santos': 'dr-raphael.png',
  'Dra. Silvia Nogueira Marx Gonzaga': 'dra-silvia.jpg',
  'Dra. Thaís Godinho Caldeira': 'dra-thais.png',
  'Dr. Lucas Pinto Cavalcante': 'dr-lucas.jpg',
  'Dra. Bruna Cristina Leonel S. Barbosa': 'br-bruna.png',
  'Dr. Samuel B. Francisco de Souza': 'dr-samuel.jpg',
}

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

interface ContentDoctor {
  name: string
  crm: string
  rqe?: string
  areas: string[]
  age_policy?: { min_age: number | null; all_ages: boolean }
}

async function uploadPhoto(localFileName: string): Promise<string | null> {
  const srcPath = join(process.cwd(), 'public', 'images', 'doctors', localFileName)
  if (!existsSync(srcPath)) {
    console.warn(`[seed] Foto não encontrada: ${srcPath} — seguindo sem foto`)
    return null
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn(
      `[seed] BLOB_READ_WRITE_TOKEN ausente — registrando médico sem foto (${localFileName})`
    )
    return null
  }
  const buffer = await readFile(srcPath)
  const ext = extname(localFileName).toLowerCase()
  const contentType = CONTENT_TYPES[ext] ?? 'application/octet-stream'
  const pathname = `doctors/seed-${localFileName}`
  const blob = await put(pathname, buffer, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  })
  return blob.url
}

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME?.trim()
  const password = process.env.ADMIN_PASSWORD
  if (!username || !password) {
    console.log('[seed] ADMIN_USERNAME/ADMIN_PASSWORD ausentes — pulando seed de usuário')
    return
  }
  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) {
    console.log(`[seed] Usuário "${username}" já existe — pulando`)
    return
  }
  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.user.create({ data: { username, passwordHash } })
  console.log(`[seed] Usuário "${username}" criado`)
}

async function seedDoctors() {
  const existingCount = await prisma.doctor.count()
  if (existingCount > 0) {
    console.log(`[seed] ${existingCount} médicos já cadastrados — pulando seed de médicos`)
    return
  }

  const contentPath = join(process.cwd(), 'lib', 'content.json')
  const raw = await readFile(contentPath, 'utf-8')
  const content = JSON.parse(raw)
  const rawDoctors: ContentDoctor[] = content?.pages?.[2]?.doctors ?? []
  const active = rawDoctors.filter((d) => d.name in DOCTOR_PHOTOS)

  console.log(`[seed] Migrando ${active.length} médicos do content.json`)

  let order = 0
  for (const d of active) {
    const photoUrl = await uploadPhoto(DOCTOR_PHOTOS[d.name])
    await prisma.doctor.create({
      data: {
        name: d.name,
        crm: d.crm,
        rqe: d.rqe ?? null,
        photoUrl,
        areas: d.areas,
        minAge: d.age_policy?.all_ages ? null : d.age_policy?.min_age ?? null,
        allAges: d.age_policy?.all_ages ?? true,
        displayOrder: order++,
      },
    })
    console.log(`  · ${d.name}${photoUrl ? ' (com foto)' : ' (sem foto)'}`)
  }
}

async function main() {
  await seedAdmin()
  await seedDoctors()
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error('[seed] Erro:', err)
    await prisma.$disconnect()
    process.exit(1)
  })
