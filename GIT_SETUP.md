# Git Setup za Drugi Account

## Opcija 1: Brzo (HTTPS sa tokenom)

```powershell
# Inicijalizuj Git
git init

# Dodaj sve fajlove
git add .
git commit -m "Initial commit - PC Builder"

# Dodaj remote (zamijeni USERNAME i REPO_NAME)
git remote add origin https://github.com/DRUGI_USERNAME/pc-builder.git

# Push (zatraži će token)
git push -u origin main
```

Kada te pita za **password**, NE stavljaj lozinku nego **GitHub Personal Access Token**:
1. Idi na GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate new token > odaberi `repo` permissions
3. Kopiraj token i stavi ga umjesto passworda


## Opcija 2: Konfiguriši SSH za dva accounta

### 1. Generiši novi SSH ključ za drugi account:

```powershell
ssh-keygen -t ed25519 -C "email_drugog_accounta@example.com" -f ~/.ssh/id_ed25519_drugi_acc
```

### 2. Dodaj SSH ključ na GitHub drugog accounta:

```powershell
# Kopiraj javni ključ
cat ~/.ssh/id_ed25519_drugi_acc.pub | clip
```

Idi na GitHub (drugi account) > Settings > SSH keys > New SSH key > paste


### 3. Konfiguriši SSH config:

Otvori/kreiraj `~/.ssh/config` i dodaj:

```
# Glavni GitHub account
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519

# Drugi GitHub account
Host github-drugi
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_drugi_acc
```

### 4. Dodaj remote sa SSH:

```powershell
cd "c:\Users\barisic\Desktop\PC BUILDER"
git init
git add .
git commit -m "Initial commit"

# Koristi github-drugi umjesto github.com
git remote add origin git@github-drugi:DRUGI_USERNAME/pc-builder.git
git push -u origin main
```


## Opcija 3: Konfiguriši Git samo za ovaj projekat

```powershell
cd "c:\Users\barisic\Desktop\PC BUILDER"

# Postavi ime i email samo za ovaj projekat
git config user.name "Ime Drugog Accounta"
git config user.email "email_drugog_accounta@example.com"

# Nastavi normalno
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/DRUGI_USERNAME/pc-builder.git
git push -u origin main
```

---

## Brz način (Preporučeno):

1. Kreiraj novi repo na GitHub (drugi account)
2. Kopiraj HTTPS URL
3. Pokreni:

```powershell
cd "c:\Users\barisic\Desktop\PC BUILDER"
git init
git add .
git commit -m "🚀 PC Builder - Next.js aplikacija za sastavljanje računara"
git remote add origin TVOJ_HTTPS_URL
git branch -M main
git push -u origin main
```

Kad te pita za credentials:
- **Username**: drugi_github_username
- **Password**: GitHub Personal Access Token (ne lozinka!)
