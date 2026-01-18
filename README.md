# 🖥️ PC Builder - Konfiguracija Računara

Aplikacija za jednostavno i brzo sastavljanje računara sa provjerom kompatibilnosti komponenti, automatskim preporukama i mogućnosti dijeljenja konfiguracija.

## ✨ Karakteristike

- 🤖 **Automatska konfiguracija** - AI pomaže da odabere najbolje komponente
- 🔧 **Ručni odabir** - Potpuna kontrola nad svakom komponentom
- 💰 **Budžet kontrola** - Prate se troškovi u realnom vremenu
- 🔄 **Zamjena komponenti** - Lako zamijenite samo dio bez resetiranja
- 📊 **Kompatibilnost** - Automatska provjera kompatibilnosti
- 🔗 **Share linkovi** - Podijelite konfiguraciju sa prijateljima
- 📱 **Responzivni dizajn** - Radi na svim uređajima

## 🚀 Brzi Start

### Zahtjevi
- Node.js 18+ 
- npm ili yarn

### Instalacija

```bash
# Kloniraj repozitorij
git clone https://github.com/Cirkquaza/pc-builder.git
cd pc-builder

# Instaliraj zavisnosti
npm install

# Kreiraj .env.local datoteku (pogledaj .env.example)
cp .env.example .env.local

# Pokreni development server
npm run dev
```

Stranica će biti dostupna na **http://localhost:3000**

### Build za produkciju

```bash
npm run build
npm run start
```

## 🔧 Environment Varijable

Pogledaj `.env.example` za sve dostupne varijable. Za lokalni razvoj:

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Za Vercel Deployment

Dodaj ove varijable u Vercel project settings:
```
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📦 Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Deployment**: Vercel

## 👥 Autori

- **Luka Ćirković** (Cirkquaza) - Glavni Developer
- **Stipe Barišić** (stipzard) - Glavni Developer

## 📝 Licenca

MIT

## 🤝 Doprinosi

Doprinosi su dobrodošli! Slobodno otvorite pull request.

## 📞 Kontakt

- GitHub: [Cirkquaza](https://github.com/Cirkquaza)
- GitHub: [stipzard](https://github.com/stipzard)

---

Sastavite vaš savršen PC! 🎮🖥️
