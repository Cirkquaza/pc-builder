# 📦 Kompletna Dokumentacija Zavisnosti

## 🎯 Overview

Ovaj dokument obuhvaća sve zavisnosti, plugine i konfiguracije potrebne za pokretanje PC Builder aplikacije.

---

## 1. RUNTIME ZAVISNOSTI (production)

Ove biblioteke su potrebne kada se aplikacija pokreće u produkciji.

### 1.1 Next.js (v14.1.0)
```bash
npm install next@14.1.0
```
**Namjena**: React framework sa built-in optimizacijama
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- Image optimization
- Automatic code splitting

**Ključne datoteke**:
- `next.config.js` - Next.js konfiguracija

---

### 1.2 React (v18.2.0)
```bash
npm install react@18.2.0
```
**Namjena**: Biblioteka za pravljenje korisničkog interfacea
- JSX komponente
- State management (useState)
- Hooks (useEffect, useContext, itd)
- Event handling

**Korišćeno u**: Svim .tsx datotekama

---

### 1.3 React-DOM (v18.2.0)
```bash
npm install react-dom@18.2.0
```
**Namjena**: Rendering React komponenti u DOM
- Povezivanje React komponenti sa HTML-om
- Client-side rendering

**Korišćeno u**: `src/app/layout.tsx`

---

### 1.4 Framer Motion (v12.26.2)
```bash
npm install framer-motion@12.26.2
```
**Namjena**: Animacije i interaktivne efekte
- Smooth transitions
- Page animations
- Hover effects
- Loading animations

**Korišćeno u**: 
- `src/app/builder/page.tsx` - sve animacije
- Motion komponente (`motion.div`, `motion.button`, itd)

**Primjer**:
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

---

## 2. RAZVOJNE ZAVISNOSTI (devDependencies)

Ove biblioteke su potrebne samo tijekom razvoja i ne dolaze sa production buildom.

### 2.1 TypeScript (v5.3.3)
```bash
npm install --save-dev typescript@5.3.3
```
**Namjena**: Statički tipizirani superset od JavaScripta
- Type checking
- Intellisense podrška
- Interface definicije

**Datoteke**:
- `tsconfig.json` - TypeScript konfiguracija
- Sve `.tsx` i `.ts` datoteke

**Primjer**:
```tsx
interface Component {
  id: string
  name: string
  price: number
}
```

---

### 2.2 Tailwind CSS (v3.4.1)
```bash
npm install --save-dev tailwindcss@3.4.1
```
**Namjena**: Utility-first CSS framework
- Rapid UI development
- Responsive design
- Dark mode podrška
- Custom components

**Datoteke**:
- `tailwind.config.js` - Tailwind konfiguracija
- `src/app/globals.css` - Tailwind directives

**Primjer**:
```tsx
<div className="bg-gradient-to-r from-cyan-400 to-blue-600 p-6 rounded-lg">
  Content
</div>
```

---

### 2.3 PostCSS (v8.4.33)
```bash
npm install --save-dev postcss@8.4.33
```
**Namjena**: CSS transformacije i procesiranje
- CSS compilacija
- Vendor prefixes (preko Autoprefixer-a)
- Plugin sistem

**Datoteke**:
- `postcss.config.js` - PostCSS konfiguracija

---

### 2.4 Autoprefixer (v10.4.17)
```bash
npm install --save-dev autoprefixer@10.4.17
```
**Namjena**: Automatski dodaje CSS vendor prefixes
- Safari kompatibilnost
- Firefox kompatibilnost
- Chrome kompatibilnost

**Primjer**:
```css
/* Input */
display: flex;

/* Output */
display: -webkit-flex;  /* Safari */
display: flex;
```

---

### 2.5 @types/react (v18.2.0)
```bash
npm install --save-dev @types/react@18.2.0
```
**Namjena**: TypeScript tipovi za React
- Props tipiziranje
- State tipiziranje
- Event tipiziranje

---

### 2.6 @types/react-dom (v18.2.0)
```bash
npm install --save-dev @types/react-dom@18.2.0
```
**Namjena**: TypeScript tipovi za React-DOM
- Rendering tipiziranje

---

### 2.7 @types/node (v20.11.0)
```bash
npm install --save-dev @types/node@20.11.0
```
**Namjena**: TypeScript tipovi za Node.js
- File system tipiziranje
- API tipiziranje

---

## 3. KONFIGURACIJSKE DATOTEKE

### 3.1 tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "allowJs": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  }
}
```

### 3.2 tailwind.config.js
```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cyan: '#06B6D4',
        blue: '#3B82F6',
      }
    },
  },
  plugins: [],
}
```

### 3.3 postcss.config.js
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3.4 next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

---

## 4. VERZIJE I KOMPATIBILNOST

| Paket | Verzija | Min. Node |
|-------|---------|-----------|
| Next.js | 14.1.0 | 18.0.0 |
| React | 18.2.0 | 16.8.0 |
| TypeScript | 5.3.3 | - |
| Tailwind CSS | 3.4.1 | - |
| Framer Motion | 12.26.2 | - |

---

## 5. INSTALACIJSKI PROCESI

### Osnovna Instalacija
```bash
npm install
```

Ovo instalira sve iz `package.json`

### Dodavanje Nove Zavisnosti
```bash
# Production zavisnost
npm install nova-biblioteka

# Dev zavisnost
npm install --save-dev nova-biblioteka
```

### Ažuriranje Zavisnosti
```bash
npm update
npm outdated
```

### Čišćenje Cache-a
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 6. BUILD PROCES

### Development Build
```bash
npm run dev
```
- Hot module reloading
- Source maps za debugging
- Spora optimizacija

### Production Build
```bash
npm run build
npm start
```
- Optimizovani bundle
- Minifikovani kod
- Maksimalne performanse

---

## 7. SCRIPT KOMANDE

| Komanda | Datoteka | Funkcija |
|---------|----------|----------|
| `npm run dev` | package.json | Pokreni dev server |
| `npm run build` | package.json | Napravi production build |
| `npm start` | package.json | Pokreni production server |
| `npm run lint` | package.json | Provjeravanja i ispravke |

---

## 8. OPTIMIZACIJSKE BIBLIOTEKE

### Built-in Optimizacije (Next.js)
- Image optimization
- Code splitting
- Dynamic imports
- SSR/SSG

### Tailwind Purgecss
- CSS minifikacija
- Nekorišćene klase se uklanjaju
- Manji CSS bundle

---

## 9. SIGURNOST ZAVISNOSTI

```bash
# Provjera sigurnosnih ranjivosti
npm audit

# Automatski popravak
npm audit fix
```

---

## 10. DODACI I EKSTENZIJE

### VSCode Extensions (Preporučeni)
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- TypeScript Vue Plugin
- Thunder Client (za API testiranje)

### Browser Extensions
- React Developer Tools
- Redux DevTools

---

## 📊 Veličina Paketa

```
node_modules/ ~ 500 MB (instalacija)
.next/       ~ 100-200 MB (build)
```

---

## 🔗 Korisni Linkovi

- [Next.js Dokumentacija](https://nextjs.org/docs)
- [React Dokumentacija](https://react.dev)
- [TypeScript Dokumentacija](https://www.typescriptlang.org)
- [Tailwind CSS Dokumentacija](https://tailwindcss.com)
- [Framer Motion Dokumentacija](https://www.framer.com/motion)

---

**Verzija**: 1.1-stable  
**Zadnja ažuriranja**: Januar 2026
