# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Medical ophthalmology clinic website (Olhares Oftalmologia, Divinópolis-MG, Brazil). Portuguese (pt-BR) content throughout. Single-page marketing site built with Next.js App Router — all sections render on the homepage (`/`) and navigation uses anchor links.

## Commands

```bash
npm run dev              # Dev server at localhost:3000
npm run build            # prisma generate && next build
npm run start            # Start production server
npm run lint             # ESLint
npm run db:migrate       # prisma migrate dev
npm run db:generate      # prisma generate
npm run db:seed          # Seeds Doctors do content.json (idempotente)
npm run db:studio        # Prisma Studio
npm run test:e2e         # Playwright E2E
npm run hash-password    # Gera hash bcrypt (arg = senha em claro)

docker compose up -d     # Postgres local na porta 5432 (dev/test)
```

Package manager is **npm** (package-lock.json).

## Architecture

**Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS 3 · Prisma 6 + Postgres (Vercel Postgres / Neon) · iron-session · Vercel Blob

> Nota: Prisma 6 em vez de 7 pra manter coerência com o padrão ffingers e evitar o adapter pattern novo do 7 (exige `prisma.config.ts` + `@prisma/adapter-pg`). Trade-off consciente.

### Data Model

Médicos vivem no Postgres (tabela `Doctor`). User admin na tabela `User` (bootstrap manual, fora do seed — criar com `scripts/hash-password.ts` + INSERT direto ou Prisma Studio). Demais conteúdos (hero, about, services, convenios, SEO, contact copy) seguem em **`lib/content.json`** — só a seção de médicos saiu do JSON. Componentes do site importam `content.json` diretamente.

### Admin Panel

`/admin` contém login e CRUD de médicos. Proteção via `middleware.ts` (iron-session cookie). Upload de fotos em Vercel Blob. Endpoint público `GET /api/doctors` retorna a lista ordenada por `displayOrder`. Mutations disparam `revalidateTag('doctors')` pra atualizar home imediatamente.

Route groups:
- `app/(site)/*` — site público (Header/Footer/WhatsApp)
- `app/admin/*` — admin (layout próprio, sem chrome do site)
- `app/api/doctors` — endpoint público
- `app/api/admin/*` — endpoints protegidos (login, logout, doctors CRUD, upload)

### Page & Component Structure

- `app/layout.tsx` — Root layout (html/body, GTM, Analytics)
- `app/(site)/layout.tsx` — Site chrome (Header/Footer/WhatsAppButton)
- `app/(site)/page.tsx` — Home page that composes all section components in order
- `app/admin/layout.tsx` — Admin shell (sem chrome do site)
- `components/` — One file per section, all PascalCase `.tsx`:
  - `Header` / `Footer` — Navigation and site chrome
  - `Hero` — Image carousel (`'use client'`, manages slide state + timer)
  - `About`, `InstitucionalSection`, `TeamSection`, `ServicesSection`, `ConveniosSection`, `ContactSection` — Content sections
  - `WhatsAppButton` — Floating CTA

Components that need interactivity use `'use client'` (Header, Hero, ServicesSection, ConveniosSection, WhatsAppButton). The rest are server components.

### Anchor Navigation IDs

Sections use these IDs for in-page navigation: `#sobre`, `#corpo-clinico`, `#servicos`, `#convenios`, `#contato`, `#agendar`.

## Key Conventions

- **Imports:** Use the `@/` path alias (maps to project root)
- **Icons:** Lucide React — import individual icons, apply sizing via Tailwind classes
- **Images:** Always use `next/image`. Doctor photos in `public/images/doctors/`, hero images in `public/images/`, insurance logos in `public/images/convenios/`
- **Styling:** Tailwind utility classes only (no CSS modules, no styled-components). Custom colors defined in `tailwind.config.ts`: `primary` (#0086bf), `teal` (#088089), `terracota` (#C47F5B)
- **Responsive:** Mobile-first — base styles for mobile, then `md:` and `lg:` breakpoints
- **External links:** WhatsApp uses `wa.me/55{phone}` format with pre-filled message text; all `target="_blank"` links include `rel="noopener noreferrer"`
- **Envs obrigatórias** (ver `.env.example`): `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `SESSION_PASSWORD` (mín. 32 chars). Usuário admin vive no banco (criado via `scripts/hash-password.ts` + insert direto ou Prisma Studio — bootstrap fora do seed).
