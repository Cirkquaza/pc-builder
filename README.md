# PC Builder

Dobrodošli u PC Builder! Ova aplikacija omogućava korisnicima da jednostavno sastave svoj idealan računar odabirom komponenti i automatskim provjeravanjem kompatibilnosti.

## 📋 Preduslovi

Prije nego što pokrenete aplikaciju, potrebno je da imate instalirano:

- **Node.js** (verzija 18.0 ili novija)
  - Preuzmite sa: https://nodejs.org/
  - Provjerite instalaciju: `node --version`
  
- **npm** (dolazi sa Node.js instalacijom)
  - Provjerite instalaciju: `npm --version`

- **Git** (za kloniranje projekta)
  - Preuzmite sa: https://git-scm.com/
  - Provjerite instalaciju: `git --version`

## 🚀 Instalacija

### 1. Kloniranje repozitorija

```bash
git clone https://github.com/vase-korisnicko-ime/pc-builder.git
cd pc-builder
```

### 2. Instalacija zavisnosti

```bash
npm install
```

## 💻 Pokretanje aplikacije

### Development mod

Za pokretanje aplikacije u development modu sa hot reload funkcijom:

```bash
npm run dev
```

Aplikacija će biti dostupna na: `http://localhost:3000`

### Production build

Za kreiranje optimizovane production verzije:

```bash
npm run build
npm start
```

## 🏗️ Struktura projekta

```
pc-builder/
├── src/
│   ├── components/      # React komponente
│   ├── pages/          # Stranice aplikacije
│   ├── utils/          # Pomoćne funkcije
│   ├── data/           # Podaci o komponentama
│   └── styles/         # CSS/SCSS stilovi
├── public/             # Statički fajlovi
├── package.json        # Zavisnosti projekta
└── README.md          # Ovaj fajl
```

## 🎯 Funkcionalnosti

- ✅ Odabir računarskih komponenti (procesor, matična ploča, RAM, GPU, napajanje, kućište)
- ✅ Automatska provjera kompatibilnosti između komponenti
- ✅ Prikaz ukupne cijene sistema
- ✅ Procjena potrošnje napajanja
- ✅ Spremanje i dijeljenje konfiguracija

## 🛠️ Tehnologije

- **Frontend Framework**: React / Next.js
- **Stilizacija**: CSS Modules / Tailwind CSS
- **State Management**: React Context API / Zustand
- **Build Tool**: Vite / Webpack

## 📝 Korištenje

1. Otvorite aplikaciju u browseru
2. Odaberite kategoriju komponente (npr. Procesor)
3. Pregledajte dostupne opcije i odaberite željenu komponentu
4. Ponovite za sve potrebne komponente
5. Sistem će automatski provjeriti kompatibilnost
6. Pregledajte ukupnu cijenu i specifikacije vašeg PC-a

## 🐛 Rješavanje problema

### Port je već zauzet

Ako je port 3000 zauzet, možete promijeniti port:

```bash
PORT=3001 npm run dev
```

### Greške pri instalaciji

Pokušajte obrisati `node_modules` folder i `package-lock.json`, pa ponovo instalirajte:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Problemi sa cachom

Očistite npm cache:

```bash
npm cache clean --force
```

## 🤝 Doprinos projektu

Želite doprinijeti? Sjajno!

1. Forkujte repozitorij
2. Kreirajte feature branch (`git checkout -b feature/NovaFunkcionalnost`)
3. Commitujte promjene (`git commit -m 'Dodana nova funkcionalnost'`)
4. Pushujte branch (`git push origin feature/NovaFunkcionalnost`)
5. Otvorite Pull Request

## 📄 Licenca

Ovaj projekat je licenciran pod MIT licencom - pogledajte [LICENSE](LICENSE) fajl za detalje.

## 📞 Kontakt

Za pitanja ili probleme, možete:
- Otvoriti issue na GitHub-u
- Kontaktirati putem email-a

## 🎉 Zahvalnice

Hvala svim kontributorima koji su pomogli u razvoju ovog projekta!

---

**Napomena**: Ovo je aktivan projekat u razvoju. Nove funkcionalnosti se redovno dodaju!
