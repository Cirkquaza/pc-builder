# 🖥️ PC Builder — Profesionalna Web Aplikacija

Web aplikacija za sastavljanje i konfiguraciju računara uz provjeru kompatibilnosti, AI preporuke, forum, i integraciju sa Big Bang katalogom za proizvode i cijene.

**Live demo:** https://pc-builder-delta.vercel.app

---

## ✨ Ključne mogućnosti

### 🎯 Builder
- 🤖 **AI konfiguracija** - automatski prijedlozi komponenti putem Groq API
- 🔧 **Ručni odabir** - odaberi komponente sa provjerom kompatibilnosti
- 💰 **Budžet tracking** - prati ukupnu cijenu u realnom vremenu
- 🔄 **Zamjena dijelova** - mijenjaj komponente bez resetiranja ostalih
- 📊 **Validacija kompatibilnosti** - provjera tipova soketa i specifikacija
- 🔗 **Dijeljenje** - podijeli konfiguraciju putem shareable linka

### 🛒 Shop
- 📦 **Live proizvodi** - podaci sa Big Bang API-ja (sa fallback-om)
- 🔎 **Pretraga i filter** - pronađi proizvode po imenu, brandu ili kategoriji
- 💳 **Direktna kupovina** - "Kupi na Big Bang" dugmad sa live linkovima
- ⚠️ **Fallback upozorenje** - jasna poruka kada su podaci iz fallback-a

### 💬 Forum
- 📝 **Ticketi (teme)** - postavi pitanja i diskutuj
- 💭 **Komentari** - diskutuj u temama
- ⭐ **Rating sistem** - ocijeni kvalitetu post-a (0-10 zvijezdica)
- 👏 **Clap sistem** - označi korisne post-ove
- 📊 **Average rating** - svaki korisnik daje svoju zvijezdicu, prikazuje se AVERAGE

### 📐 Setups
- 📤 **Upload konfiguracija** - spremi svoje PC setupe
- 📸 **Slike** - dodaj sliku svakog setup-a
- 💬 **Komentari** - drugi korisnici mogu komentirati
- ⭐ **Rating** - ocijeni setup (same logika kao forum)
- 👥 **Leaderboard** - top setups po broju zainteresiranih korisnika

### 👤 Profil
- ✅ **Email verifikacija** - opciona, može se aktivirati iz profila
- 📊 **Moji setups** - pregled svih tvojih postavljenih konfiguracija
- 🔐 **Sigurna prijava** - NextAuth sa kredencijalima

---

## 🧱 Tech Stack

| Komponenta | Tehnologija |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Neon), Prisma ORM |
| Auth | NextAuth v5 |
| Email | Resend |
| AI | Groq API |
| External API | Big Bang (katalog proizvoda) |
| Proxy | Cloudflare Workers (opciono) |
| Deployment | Vercel |

---

## 🧭 Arhitektura sistema

```mermaid
graph TB
  subgraph Client["🌐 Klijent (Browser)"]
    Home["Početna"]
    Builder["Builder"]
    Shop["Shop"]
    Forum["Forum"]
    Setups["Setups"]
    Profile["Profil"]
  end

  subgraph API["🔧 Next.js API Routes"]
    Products["/api/products<br/>Big Bang"]
    Auth["/api/auth/*<br/>NextAuth, Resend"]
    Chat["/api/chat<br/>Groq AI"]
    Forum_API["/api/forum/*<br/>Ticketi, poruke"]
    Setups_API["/api/setups/*<br/>Konfiguracije"]
    Rating["/api/*/rating<br/>Star sistem"]
  end

  subgraph External["🌍 Vanjski servisi"]
    BigBang["Big Bang API"]
    Resend_Service["Resend (Email)"]
    Groq["Groq LLM"]
    Cloudflare["Cloudflare Workers<br/>optional"]
  end

  subgraph Database["🗄️ Baza podataka"]
    PG["PostgreSQL<br/>via Neon"]
  end

  Client -->|HTTP| API
  API -->|Fetch| BigBang
  API -->|SMTP| Resend_Service
  API -->|REST| Groq
  API -->|POST/GET| PG
  BigBang -->|optional proxy| Cloudflare
```

---

## 🔁 Tokovi podataka

### 📦 Učitavanje proizvoda (Shop/Builder)

```mermaid
sequenceDiagram
  participant Client
  participant API as /api/products
  participant BigBang
  participant Fallback

  Client->>API: GET /api/products?category=cpu&limit=10
  API->>BigBang: POST /api/nuxtapi/catalog/products/
  
  alt Big Bang dostupan
    BigBang-->>API: ✓ items[]
    API-->>Client: ✓ {success:true, products:[]}
  else 403/CORS/timeout
    BigBang--xAPI: ✗ Error
    API->>Fallback: Koristi hardcoded podatke
    Fallback-->>API: fallback products[]
    API-->>Client: ✓ {success:false, products:[]} (warning prikazati)
  end
```

### 📧 Email verifikacija

```mermaid
sequenceDiagram
  participant User
  participant App as PC Builder
  participant Resend
  participant DB as PostgreSQL

  User->>App: 1. Registracija (email, password, ime)
  App->>DB: Kreiraj usera sa emailVerified=null
  App->>DB: Kreiraj verification token (15 min)
  App->>Resend: Pošalji verification kod
  Resend-->>User: ✉️ Kod u emailu (ako je domain verified)
  
  User->>App: 2. Unesi kod na /auth/verify
  App->>DB: Validiraj token
  DB-->>App: ✓ Token ok
  App->>DB: Postavi emailVerified = sada
  App-->>User: ✅ Email verificiran!
  
  User->>App: 3. Login (email, password)
  App->>DB: Pronađi usera
  DB-->>App: User (emailVerified bilo kada)
  App-->>User: ✅ Logiran! (email verifikacija nije obavezna)
```

### ⭐ Rating sistem (Forum & Setups)

```mermaid
sequenceDiagram
  participant User1 as User A (rating)
  participant User2 as User B (gleda rating)
  participant API as /api/.../rating
  participant DB as PostgreSQL

  User1->>API: POST rating=7
  API->>DB: Upsert TicketRating<br/>(create if new, update if exists)
  DB->>DB: Kalkuliraj aggregate<br/>AVG(rating)
  DB-->>API: avg_rating = 6.5
  API-->>DB: Update ticket.rating = 6.5
  
  User2->>API: GET /api/forum/tickets/[id]
  API->>DB: Pronađi ticket
  DB-->>API: {rating: 6.5}
  API-->>User2: Prikaži: ⭐⭐⭐⭐⭐⭐☆ (6.5/10)
```

---

## 🗄️ Baza podataka (Prisma modeli)

### Autentifikacija
- **User** — korisnici sa emailVerified, password, name
- **VerificationToken** — email verification tokeni (15 min expiry)

### Forum
- **Ticket** — forum teme sa rating (avg)
- **TicketMessage** — komentari na ticketima sa rating
- **TicketRating** — 1 rating po korisniku po ticketu (composite key: ticketId_userId)
- **TicketClap** — 1 clap po korisniku po ticketu

### Setups
- **Setup** — korisničke PC konfiguracije sa rating
- **SetupComment** — komentari na setupima
- **SetupCommentRating** — rating (1 po korisniku)

### Rating logika
```
TicketRating: {
  id: String
  ticket: Ticket
  ticketId: String
  user: User
  userId: String
  rating: Float (0-10)
  
  @@unique([ticketId, userId])  // ← Osigurava 1 rating po korisniku!
  @@index([ticketId])
}

// UPSERT logika:
// - Ako korisnik već dao rating → UPDATE ga
// - Ako prvi put → CREATE
// - Svaki put se računa AVERAGE od svih ratings
```

---

## ⚙️ Instalacija i setup

### Preduvjeti
- **Node.js 18+**
- **npm/yarn**
- **PostgreSQL** (ili Neon account)
- **Resend account** (za email)
- **Groq API key** (za AI)

### Koraci

1. **Kloniraj repozitorij**
   ```bash
   git clone https://github.com/Cirkquaza/pc-builder.git
   cd pc-builder
   ```

2. **Instaliraj zavisnosti**
   ```bash
   npm install
   ```

3. **Kreiraj `.env.local`** (kopiraj iz `.env.example`)
   ```bash
   cp .env.example .env.local
   ```

4. **Popuni environment varijable** (pogledaj dolje)

5. **Inicijalizuj bazu**
   ```bash
   npx prisma db push
   ```

6. **Pokreni dev server**
   ```bash
   npm run dev
   ```

   Dostupno na **http://localhost:3000**

---

## 🔐 Environment varijable

Pogledaj `.env.example` — sve su detaljno dokumentirane.

| Varijabla | Opis | Primjer |
|---|---|---|
| `DATABASE_URL` | PostgreSQL konekcija | `postgresql://user:pass@host/db` |
| `NEXTAUTH_SECRET` | NextAuth secret | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Base URL (lokalno/prod) | `http://localhost:3000` |
| `RESEND_API_KEY` | Resend API ključ | `re_...` |
| `RESEND_FROM` | **Verificirani sender** | `PC Builder <no-reply@yourdomain.com>` |
| `GROQ_API_KEY` | Groq API ključ | `gsk_...` |
| `BIGBANG_PROXY_URL` | Cloudflare Worker URL (opciono) | `https://your-worker.workers.dev` |
| `BIGBANG_PROXY_TOKEN` | Proxy Bearer token (opciono) | `your_token_123` |

### ⚠️ RESEND_FROM — Važno!
- Resend u **sandbox mode** (default) šalje samo na verified adrese
- Za slanje na **sve** adrese, trebam:
  1. **Verifikuj domenu** u Resend dashboard (Settings → Domains)
  2. **Postavi `RESEND_FROM`** na tu domenu
  3. Primjer: `PC Builder <no-reply@yourdomain.com>`

Bez ovoga, email se neće slati vanjskim korisnicima!

---

## 📦 Skripte

```bash
npm run dev      # Development server (hot reload)
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint
npm run type-check # TypeScript check
```

---

## 🚀 Deployment

### Vercel (preporučeno)

1. **Connectaj GitHub repozitorij** na Vercel
2. **Postavi environment varijable** u Vercel dashboard (Project Settings → Environment Variables)
3. **Deploy se automatski** sa svakim `git push` u `main` branch

### Lokalni deployment
```bash
npm run build
npm start
```

**⚠️ Napomena:** `.env` nikad ne smije biti u git-u! Koristi `git update-index --skip-worktree .env` ako trebas local testiranje.

---

## 🧩 Big Bang integracija

### Problem: CORS blokada
Big Bang API je zaštićen Cloudflare-om — direktni pozivi iz browser-a su blokirani. 

### Rješenje: Server-side proxy
Naš `/api/products` ruta:
1. Pokušava dohvatiti podatke sa Big Bang API-ja
2. Ako uspije → vraća live podatke
3. Ako Big Bang ne odgovori → vraća fallback podatke + warning

### Još bolje: Cloudflare Worker (opciono)

U ovom repozitoriju: [`workers/bigbang-proxy.js`](workers/bigbang-proxy.js)

**Koraci za deploy:**

```bash
# 1. Instaliraj Wrangler CLI
npm install -g wrangler

# 2. Kreiraj Cloudflare projekat
wrangler init

# 3. Kopiraj workers/bigbang-proxy.js u wrangler projekt
# 4. Postavi PROXY_TOKEN u wrangler.toml (opciono)
# 5. Deployaj
wrangler deploy

# 6. Kopiraj Worker URL i postavi u Vercel:
# BIGBANG_PROXY_URL=https://your-worker.your-subdomain.workers.dev
# BIGBANG_PROXY_TOKEN=your_optional_token
```

Nakon toga, `/api/products` koristi proxy i **uvijek** dobija live podatke.

---

## 🛠️ Troubleshooting

### ❌ CORS greške u browser console-u
```
"Access to fetch at 'https://www.bigbang.hr/...' has been blocked by CORS policy"
```
- **Problem:** Pokušavaš direktno pozivati Big Bang iz browser-a
- **Rješenje:** Koristi `/api/products` rutu (server-side proxy)

### ❌ 403 Forbidden ili timeout iz Big Bang
```
Error rating comment: [403]
```
- **Problem:** Big Bang API je nedostupan ili preopterećen
- **Rješenje:** Fallback se aktivira automatski. Vidi upozorenje u shop-u.

### ❌ Resend ne šalje emaile
```
"Failed to send verification email"
```
- **Uzrok 1:** Sandbox mode — RESEND_FROM nije verified domena
  - Rješenje: Verifikuj domenu u Resend dashboard
- **Uzrok 2:** RESEND_API_KEY nije ispravan
  - Rješenje: Kopiraj novi ključ iz https://resend.com/api-keys

### ❌ Prisma error
```
error: ERROR: relation "User" does not exist
```
- Rješenje: `npx prisma db push`

### ❌ Database konekcija ne radi
```
ECONNREFUSED 127.0.0.1:5432
```
- Rješenje: Provjeri `DATABASE_URL` u `.env.local`
- Za Neon: https://console.neon.tech → klik na project → Copy connection string

---

## 🔒 Security

- ✅ NextAuth za authentication
- ✅ CORS zaštita
- ✅ Rate limiting (preporuka: Vercel Analytics)
- ✅ SQL injection zaštita (Prisma parameterized queries)
- ✅ HTTPS u produkciji
- ✅ Email tokens sa 15-min expiry

---

## 📊 Status projekta

- ✅ Stabilan build (Next.js 14.2.35)
- ✅ TypeScript sa 0 greški
- ✅ Fallback sistem za Big Bang
- ✅ Forum sa rating sistemom (UPSERT logika)
- ✅ Setups sa komentarima
- ✅ Email verifikacija (opciona)
- ✅ Cloudflare Worker proxy kod (spreman za deploy)
- ✅ Shop sa live upozorenjem za fallback podatke

---

## 🎯 Roadmap (budućnost)

- [ ] Push notifikacije za komentare
- [ ] Real-time chat
- [ ] Dark mode toggle (Tailwind dark: prefix)
- [ ] Social login (GitHub, Google)
- [ ] Advanced builder filters (brand, socket, spec)
- [ ] PCPartPicker integracija

---

## 📄 Licence

MIT — Slobodno koristi!

---

## 👤 Autor

Sagrađeno sa ❤️ za pc-builder zajednicu.

**GitHub:** https://github.com/Cirkquaza/pc-builder

---

**Zadnja ažuriranja:** 30.01.2026  
**Verzija:** 1.2.0 (Email verification, Upsert rating, Shop warnings)
