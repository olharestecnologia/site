# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Medical ophthalmology clinic website (Olhares Oftalmologia, Divinópolis-MG, Brazil). Portuguese (pt-BR) content throughout. Single-page marketing site built with Next.js App Router — all sections render on the homepage (`/`) and navigation uses anchor links.

## Commands

```bash
npx next dev       # Dev server at localhost:3000
npx next build     # Production build
npx next start     # Start production server
npx next lint      # ESLint
```

Package manager is **npm** (package-lock.json).

## Architecture

**Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS 3

### Content-Driven Data Model

All site content lives in **`lib/content.json`** — doctor profiles, services, contact info, SEO metadata, section copy. Components import this file directly and render from it. To update text, doctors, services, or insurance plans, edit this JSON file rather than component code.

### Page & Component Structure

- `app/layout.tsx` — Root layout with metadata, Google Tag Manager (GTM-KV36QHGZ), Vercel Analytics
- `app/page.tsx` — Home page that composes all section components in order
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
- **No API routes or database** — purely static site driven by JSON content
