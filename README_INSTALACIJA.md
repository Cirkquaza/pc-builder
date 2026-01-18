# PC Builder - Kompletan Vodič Instalacije

## 📋 Sadržaj Projekta

### Tehnologije
- **Next.js 14.1.0** - React framework za produkciju
- **React 18.2.0** - UI biblioteka
- **TypeScript 5.3.3** - Statički tipizirani JavaScript
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Framer Motion 12.26.2** - Animacije i interakcije
- **PostCSS 8.4.33** - CSS transformacije
- **Autoprefixer 10.4.17** - CSS vendor prefixes

### Alati za Razvoj
- Node.js 18+ (potreban)
- npm ili yarn (paket menadžer)
- Git (verzionisanje koda)

---

## 🚀 Kako Instalirati

### Korak 1: Provjeri da li imaš Node.js

```bash
node --version
npm --version
```

Trebam ti **Node.js 18.0.0** ili novije. Ako nemaš, preuzmi sa https://nodejs.org/

### Korak 2: Kloniraj Projekt

```bash
git clone https://github.com/Cirkquaza/pc-builder.git
cd pc-builder
```

### Korak 3: Instaliraj Zavisnosti

```bash
npm install
```

Ovo će instalirati sve iz `package.json`:
- React i React-DOM
- Next.js
- Tailwind CSS
- Framer Motion
- TypeScript
- I sve ostale biblioteke

### Korak 4: Pokreni Razvoj Server

```bash
npm run dev
```

Otidi na **http://localhost:3000** i vidiš aplikaciju uživo!

---

## 📦 Instaliran Paketi

### Glavni Paketi (Dependencies)
| Paket | Verzija | Namjena |
|-------|---------|---------|
| next | 14.1.0 | React framework sa SSR |
| react | 18.2.0 | UI biblioteka |
| react-dom | 18.2.0 | React rendering |
| framer-motion | 12.26.2 | Animacije i interakcije |

### Razvojni Paketi (DevDependencies)
| Paket | Verzija | Namjena |
|-------|---------|---------|
| typescript | 5.3.3 | Statički tipiziranje |
| tailwindcss | 3.4.1 | CSS framework |
| postcss | 8.4.33 | CSS procesiranje |
| autoprefixer | 10.4.17 | CSS kompatibilnost |
| @types/react | 18.2.0 | React TypeScript tipovi |
| @types/react-dom | 18.2.0 | React-DOM TypeScript tipovi |
| @types/node | 20.11.0 | Node.js TypeScript tipovi |

---

## 🛠️ Dostupne Komande

```bash
# Razvoj sa auto-reload
npm run dev

# Production build
npm build

# Pokreni production verziju
npm start

# Lint provera (tipske greške, formatiranje)
npm run lint
```

---

## 📁 Struktura Projekta

```
pc-builder/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Početna stranica
│   │   ├── globals.css         # Globalni stilovi
│   │   ├── builder/
│   │   │   └── page.tsx        # PC Builder glavna aplikacija (1196 linija)
│   │   ├── info/
│   │   │   └── page.tsx        # Informaciona stranica
│   │   └── api/
│   │       └── check-availability/
│   │           └── route.ts    # API za dostupnost komponenti
│   └── components/
│       └── Navigation.tsx      # Navigacioni komponenti
├── public/                      # Statički resursi
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript konfiguracija
├── tailwind.config.js          # Tailwind CSS konfiguracija
├── postcss.config.js           # PostCSS konfiguracija
├── next.config.js              # Next.js konfiguracija
└── .env.example                # Primjer environment varijabli
```

---

## 🌐 Okruženja

### Razvoj
```bash
npm run dev
# http://localhost:3000
```

### Production
```bash
npm run build
npm start
```

---

## 🔧 Konfiguracija

### Environment Varijable
Kreiraj `.env.local` datoteku u root foldera:

```env
# Primjer
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Vidi `.env.example` za sve dostupne varijable.

---

## 🎯 Funkcionalnosti Aplikacije

### 1. **Odabir Budžeta**
- Nekoliko predefinirane opcije (1000€, 2000€, 3500€, bez limita)
- Custom budžet

### 2. **Izbor Komponenti**
- **7 koraka**: Procesor → Matična ploča → Grafička → RAM → Storage → Napajanje → Kućište
- Filtriranje po brandu
- Provjeravanja kompatibilnosti budžeta

### 3. **Automatski Build (Auto-Build)**
- Automatski odabira optimalnu konfiguraciju po budžetu
- Koristi omjere za distribuciju budžeta

### 4. **Ručni Izbor**
- Korak-po-korak odabir sa detaljnim opisima
- Mogućnost zamjene komponenti

### 5. **Dijeljenje Konfiguracije**
- Share linkovi sa base64 enkodiranom konfiguracijom
- Učitavanje iz URL parametara

### 6. **Gdje Kupiti**
- 7 provjerenih hrvatskih retailera:
  - Nabava.net
  - ADM.hr
  - eKupi.hr
  - BigBang.hr
  - Instar-informatika.hr
  - Svijet-medija.hr
  - Amazon.de

---

## 🐛 Troubleshooting

### Problem: Port 3000 je zauzet
```bash
npm run dev -- -p 3001
```

### Problem: node_modules nije instaliran
```bash
rm -rf node_modules
npm install
```

### Problem: TypeScript greške
```bash
npm run lint
```

### Problem: Tailwind CSS ne radi
Provjeraj da li je tailwind.config.js konfiguriran pravilno.

---

## 📊 Trenutni Status

- ✅ Glavni builder sa budžet logikom
- ✅ Share/Save konfiguracija
- ✅ 7 retailers sa link-ovima
- ✅ Responsive dizajn (mobile/desktop)
- ✅ Animacije i interakcije
- ✅ TypeScript podrška

## 🔄 Verzionisanje

- `v1.0-stable` - Prva stabilna verzija
- `v1.1-stable` - Trenutna verzija (7 retailera, clean API)

Backup branch: `backup-stable-2025-01-18-final`

---

## 📞 Podrška

Za probleme ili pitanja:
1. Provjeri `SETUP.md` za detaljne upute
2. Provjeri `GIT_SETUP.md` za Git konfiguraciju
3. Kontaktiraj razvojni tim

---

## 📄 Licenca

Projekat je vlasništvo Luka Ćirković (Cirkquaza) i Stipe Barišić (stipzard)

---

**Verzija**: 1.1-stable  
**Zadnja ažuriranja**: Januar 2026
