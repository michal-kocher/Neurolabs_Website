# NeuroLabs API - Google Generative AI Proxy

API proxy dla agenta AI w projekcie NeuroLabs. Używa Google Generative AI (Gemini) do obsługi konwersacji z agentem.

## 🚀 Getting Started

### 1. Instalacja zależności

```bash
npm install
```

### 2. Konfiguracja zmiennych środowiskowych

Stwórz plik `.env.local` w głównym folderze projektu:

```bash
# Google Generative AI (Gemini) API Key
# Pobierz klucz z: https://aistudio.google.com/app/apikey
GOOGLE_AI_API_KEY=your_api_key_here

# Opcjonalnie: wybierz model
# Dostępne: gemini-1.5-flash (szybszy), gemini-1.5-pro (bardziej zaawansowany)
GEMINI_MODEL=gemini-1.5-flash
```

### 3. Uruchomienie lokalnie

```bash
npm run dev
```

API będzie dostępne pod adresem: `http://localhost:3000`

## 📡 API Endpoints

### POST `/api/chat`

Wysyła wiadomość do agenta AI.

**Request:**
```json
{
  "message": "Zmodyfikuj komponent Home, dodaj czerwony przycisk",
  "history": [
    {
      "role": "user",
      "content": "Cześć"
    },
    {
      "role": "assistant",
      "content": "Witaj! Jak mogę pomóc?"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Zmodyfikowałem komponent Home...",
    "action": "modify_code",
    "code": "...",
    "component": "Home"
  }
}
```

### GET `/api/tools`

Zwraca listę dostępnych narzędzi dla agenta.

**Response:**
```json
{
  "success": true,
  "tools": [
    {
      "id": "modify_component",
      "name": "Modify Component",
      "description": "...",
      "parameters": {...}
    }
  ],
  "version": "1.0.0"
}
```

## 🚢 Deployment na Vercel

### Opcja 1: Przez Vercel Dashboard

1. Zaloguj się na [vercel.com](https://vercel.com)
2. Kliknij "New Project"
3. Połącz repozytorium GitHub z projektem `api`
4. Dodaj zmienną środowiskową:
   - **Name:** `GOOGLE_AI_API_KEY`
   - **Value:** Twój klucz API z Google AI Studio
5. Kliknij "Deploy"

### Opcja 2: Przez Vercel CLI

```bash
# Instalacja Vercel CLI
npm install -g vercel

# Deploy
vercel

# Dodaj zmienne środowiskowe
vercel env add GOOGLE_AI_API_KEY
```

### Konfiguracja zmiennych środowiskowych na Vercel

Po deploy, przejdź do:
**Project Settings → Environment Variables**

Dodaj:
- `GOOGLE_AI_API_KEY` - Twój klucz API
- `GEMINI_MODEL` (opcjonalnie) - `gemini-1.5-flash` lub `gemini-1.5-pro`

## 🔗 Integracja z Frontend

W projekcie React (GitHub Pages), dodaj URL do API:

```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api.vercel.app'
  : 'http://localhost:3000';

// Przykład użycia
const response = await fetch(`${API_URL}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userInput,
    history: conversationHistory
  })
});
```

## 📝 Uwagi

- **API Key:** Nigdy nie commituj `.env.local` do Git!
- **Rate Limits:** Google Gemini ma limity - sprawdź dokumentację
- **Model:** `gemini-1.5-flash` jest szybszy i tańszy, `gemini-1.5-pro` bardziej zaawansowany

## 🛠️ Tech Stack

- **Next.js 16** - Framework
- **@google/generative-ai** - Google Gemini SDK
- **TypeScript** - Type safety
