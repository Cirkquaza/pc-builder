# 🛠️ SETUP VODIČ - PC BUILDER

## 📋 Sadržaj
1. [Osnovni Setup](#osnovni-setup)
2. [Environment Varijable](#environment-varijable)
3. [Vercel Deployment](#vercel-deployment)
4. [Napredne Funkcionalnosti](#napredne-funkcionalnosti)
5. [Monitoring i Analytics](#monitoring-i-analytics)
6. [Sigurnost](#sigurnost)

---

## 🔧 Osnovni Setup

### Lokalno
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

---

## 🌍 Environment Varijable

### Obavezne (za sve)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000 (dev)
NEXT_PUBLIC_APP_URL=https://your-domain.com (prod)
```

### Analytics (Preporučeno)

#### Google Analytics
```env
NEXT_PUBLIC_GA_ID=G_XXXXXXXXXX
```

Kako dodati:
1. Kreiraj Google Analytics account
2. Kreiraj novu web property za domain
3. Kopiraj Measurement ID i stavi ga u .env.local
4. (Opciono) Kreiraj `lib/analytics.ts`:

```typescript
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
    })
  }
}
```

#### Vercel Web Analytics
- Automatski se uključi kada deployaš na Vercel
- Nema potrebe za dodavanjem koda
- Dostupno na Vercel dashboard

---

## 🚀 Vercel Deployment

### Opcija 1: Automatski (PREPORUČENO)

1. Spremi kod na GitHub
2. Idi na https://vercel.com
3. Klikni "New Project"
4. Odaberi `Cirkquaza/pc-builder`
5. Vercel će automatski detectovati Next.js
6. Klikni "Deploy"

**Prednosti:**
- Automatski redeploy sa svakim git push
- SSL certifikat besplatno
- CDN dostupan globalno
- Serverless functions

### Opcija 2: CLI Deploy

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Environment Varijable na Vercel

1. Idi na Project Settings
2. Environment Variables
3. Dodaj:
   ```
   NEXT_PUBLIC_APP_URL=https://pc-builder-xxxx.vercel.app
   NEXT_PUBLIC_GA_ID=G_XXXXXXXXXX (ako koristiš)
   ```

---

## 🎯 Napredne Funkcionalnosti

### 1. Discord Share Integration

**Omogući Discord webhook za instant sharing:**

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your_webhook_id
```

Kako kreirati:
1. Idi na Discord server settings
2. Integrations → Webhooks
3. New Webhook
4. Kopiraj URL

### 2. Email Notifications

```env
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 3. Database - Spremi Konfiguracije

Koristi **Supabase** (PostgreSQL):

```env
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

---

## 📊 Monitoring i Analytics

### Rate Limiting (zaštita od spam)

```env
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### Error Tracking - Sentry

```env
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

---

## 🔒 Sigurnost

### 1. NIKAD ne commit-uj .env.local
- Već je u .gitignore
- Koristi .env.example kao template

### 2. Environment Secrets
- Sve sensitive podatke stavi u .env.local
- Na Vercel koristi Project Settings → Environment Variables

### 3. Rate Limiting
- Sprječava spam i DDoS napade
- Svi share linkovi koriste base64 encoding

---

## 📋 Checklist

- [x] Instalao npm zavisnosti
- [x] Kreiram `.env.local` iz `.env.example`
- [x] Testirao lokalno `npm run dev`
- [x] Conectao GitHub na Vercel
- [x] Deployao na Vercel
- [x] Testirao share link funkcionalnost
- [ ] Dodao Google Analytics (opciono)
- [ ] Testirao na mobilnom uređaju

---

## 🆘 Troubleshooting

### Build error - "useSearchParams"
✅ Već ispravljen - Suspense boundary je dodan

### Build ne prolazi na Vercel
- Provjeri da li su sve `.env` varijable dodane u Vercel
- Pokreni `npm run build` lokalno
- Provjeri build logs na Vercel

### Share linkovi ne rade
- Provjeri `NEXT_PUBLIC_APP_URL` u production env
- Testiraj sa punim URL-om sa domenom

---

**Projekt:** PC Builder - Konfiguracija Računara  
**Autori:** Luka Ćirković (Cirkquaza) & Stipe Barišić (stipzard)  
**Kreirano:** 2026-01-18

**Happy Building! 🚀**

