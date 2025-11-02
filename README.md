# 🏥 Clínica Olhares Oftalmologia

Site institucional da **Olhares Oftalmologia**, centro de referência em cuidados oftalmológicos no Centro-Oeste de Minas Gerais.

## 📋 Sobre o Projeto

Website moderno e responsivo desenvolvido para a Clínica Olhares, localizada em Divinópolis/MG. O site apresenta informações sobre a clínica, corpo clínico, serviços prestados, convênios aceitos e facilita o contato com os pacientes.

### 🎯 Funcionalidades

- **Hero Section** com carrossel de imagens
- **Sobre a Clínica** com informações institucionais
- **Corpo Clínico** com perfil detalhado dos médicos e especialidades
- **Serviços** divididos em consultas, exames e cirurgias
- **Convênios** com logos dos parceiros aceitos
- **Contato** com informações de endereço e telefone
- **WhatsApp Button** flutuante para contato direto
- **Animações suaves** com Framer Motion
- **Design responsivo** otimizado para mobile, tablet e desktop

## 🚀 Tecnologias Utilizadas

- **[Next.js 14](https://nextjs.org/)** - Framework React com SSR e SSG
- **[React 18](https://react.dev/)** - Biblioteca JavaScript para interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Framer Motion](https://www.framer.com/motion/)** - Biblioteca de animações
- **[Lucide React](https://lucide.dev/)** - Ícones modernos
- **[Vercel Analytics](https://vercel.com/analytics)** - Análise de métricas

## 📁 Estrutura do Projeto

```
site/
├── app/                      # App Router do Next.js
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página inicial
│   └── globals.css          # Estilos globais
├── components/              # Componentes React
│   ├── Header.tsx           # Cabeçalho/navegação
│   ├── Hero.tsx             # Seção hero com carrossel
│   ├── About.tsx            # Sobre a clínica
│   ├── TeamSection.tsx      # Corpo clínico
│   ├── ServicesSection.tsx  # Serviços prestados
│   ├── ConveniosSection.tsx # Convênios aceitos
│   ├── ContactSection.tsx   # Informações de contato
│   ├── Footer.tsx           # Rodapé
│   └── WhatsAppButton.tsx   # Botão flutuante WhatsApp
├── lib/                     # Utilitários e dados
│   └── content.json         # Conteúdo estruturado do site
├── public/                  # Arquivos estáticos
│   └── images/              # Imagens
│       ├── convenios/       # Logos dos convênios
│       ├── doctors/         # Fotos dos médicos
│       └── hero-*.jpg       # Imagens do carrossel
├── scripts/                 # Scripts utilitários
│   ├── download-logos.js    # Download de logos
│   ├── fetch-logos.js       # Busca de logos
│   └── fetch-logos-tavily.js
└── docs/                    # Documentação e assets originais

```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Passos para rodar localmente

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd site
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:3000
```

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Executa o linter do código |

## 🎨 Customização

### Conteúdo

O conteúdo principal do site está centralizado em `lib/content.json`. Para atualizar informações como:
- Dados da clínica
- Informações de contato
- Médicos e especialidades
- Serviços oferecidos
- Meta tags SEO

Edite este arquivo e o site será atualizado automaticamente.

### Imagens

- **Hero/Carrossel**: Adicione imagens em `public/images/` com nome `hero-*.jpg`
- **Médicos**: Adicione fotos em `public/images/doctors/`
- **Convênios**: Adicione logos em `public/images/convenios/`

### Estilos

O projeto usa Tailwind CSS. Para customizar:
- **Cores e temas**: Edite `tailwind.config.ts`
- **Estilos globais**: Edite `app/globals.css`

## 🌐 Deploy

O projeto está otimizado para deploy na [Vercel](https://vercel.com/):

1. Faça push do código para o GitHub
2. Conecte o repositório na Vercel
3. A Vercel detectará automaticamente Next.js e fará o deploy

### Build de Produção

```bash
npm run build
npm run start
```

## 📞 Contato da Clínica

**Olhares Oftalmologia**
- 📍 Rua Itapecerica 403, Centro - Divinópolis/MG
- 📮 CEP: 35500-018
- ☎️ (37) 3112-0449
- 📱 WhatsApp: (37) 9-9120-0049

## 📄 Licença

ISC

---

Desenvolvido para **Clínica Olhares Oftalmologia** | Divinópolis, MG