# Deployment Guide - API na Vercel

## 📋 Wymagania

1. Konto na [Vercel](https://vercel.com) (darmowe)
2. Konto na [Google AI Studio](https://aistudio.google.com/app/apikey) - klucz API
3. Repozytorium GitHub z folderem `api/`

---

## 🚀 Krok 1: Przygotowanie repozytorium

Upewnij się, że folder `api/` jest w repozytorium GitHub:

```bash
cd api
git add .
git commit -m "Add API for Vercel deployment"
git push
```

---

## 🚀 Krok 2: Deploy na Vercel

### Opcja A: Przez Vercel Dashboard (Rekomendowane)

1. **Zaloguj się** na [vercel.com](https://vercel.com)
   - Możesz użyć konta GitHub

2. **Kliknij "Add New..." → "Project"**

3. **Importuj repozytorium**
   - Wybierz repozytorium z projektem
   - Vercel automatycznie wykryje Next.js

4. **Konfiguracja projektu:**
   - **Root Directory:** Ustaw na `api` (ważne!)
   - **Framework Preset:** Next.js (auto-detect)
   - **Build Command:** `npm run build` (domyślne)
   - **Output Directory:** `.next` (domyślne)

5. **Environment Variables:**
   - Kliknij "Environment Variables"
   - Dodaj:
     ```
     GOOGLE_AI_API_KEY = twój_klucz_api_tutaj
     GEMINI_MODEL = gemini-1.5-flash (opcjonalnie)
     ```

6. **Kliknij "Deploy"**

7. **Po deploy:**
   - Vercel wygeneruje URL typu: `https://your-project.vercel.app`
   - Skopiuj ten URL!

---

### Opcja B: Przez Vercel CLI

```bash
# Instalacja Vercel CLI
npm install -g vercel

# Przejdź do folderu API
cd api

# Deploy (pierwszy raz)
vercel

# Odpowiedz na pytania:
# - Set up and deploy? Y
# - Which scope? (wybierz swoje konto)
# - Link to existing project? N
# - Project name? (np. neurolabs-api)
# - Directory? ./
# - Override settings? N

# Dodaj zmienne środowiskowe
vercel env add GOOGLE_AI_API_KEY
# Wklej swój klucz API

# Opcjonalnie
vercel env add GEMINI_MODEL
# Wpisz: gemini-1.5-flash

# Deploy do produkcji
vercel --prod
```

---

## 🔗 Krok 3: Aktualizacja Frontendu

Po deploy, zaktualizuj `src/config/api.js` w projekcie frontendowym:

```javascript
const API_URL = import.meta.env.PROD 
  ? 'https://your-project.vercel.app'  // ← Wklej URL z Vercel
  : 'http://localhost:3000';
```

**Lub użyj zmiennej środowiskowej:**

1. Stwórz plik `.env.production` w głównym folderze projektu:
```
VITE_API_URL=https://your-project.vercel.app
```

2. Zaktualizuj `src/config/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-project.vercel.app'
    : 'http://localhost:3000');
```

---

## ✅ Krok 4: Testowanie

1. **Test lokalny API:**
   ```bash
   cd api
   npm run dev
   # Sprawdź: http://localhost:3000/api/tools
   ```

2. **Test Vercel API:**
   - Otwórz: `https://your-project.vercel.app/api/tools`
   - Powinieneś zobaczyć JSON z listą narzędzi

3. **Test z frontendu:**
   - Zbuduj frontend: `npm run build`
   - Sprawdź czy requesty idą do Vercel API

---

## 🔧 Troubleshooting

### Problem: API zwraca 500
- Sprawdź czy `GOOGLE_AI_API_KEY` jest ustawione w Vercel
- Sprawdź logs w Vercel Dashboard → Deployments → Functions

### Problem: CORS errors
- CORS jest już skonfigurowane w `route.ts`
- Jeśli nadal występują, sprawdź czy URL API jest poprawny

### Problem: Root Directory
- Jeśli Vercel nie znajduje projektu, ustaw Root Directory na `api` w ustawieniach projektu

---

## 📝 Uwagi

- **Free Tier Vercel:** 100GB bandwidth/miesiąc, wystarczy dla demo
- **API Key:** Nigdy nie commituj `.env.local` do Git!
- **Auto-deploy:** Vercel automatycznie deployuje przy każdym push do `main`

---

## 🎉 Gotowe!

Po wykonaniu tych kroków:
- ✅ API działa na Vercel
- ✅ Frontend na GitHub Pages używa Vercel API
- ✅ Wszystko działa w produkcji!

