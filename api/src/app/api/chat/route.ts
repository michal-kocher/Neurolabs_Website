import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Inicjalizacja Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Funkcja pomocnicza do wyciągania modyfikacji z tekstu (fallback)
function extractModificationsFromText(text: string): any {
  const modifications: any = {};
  const lowerText = text.toLowerCase();

  // Kolory gradientu tytułu
  if (lowerText.includes('czerwony') || lowerText.includes('red')) {
    modifications.titleColor = 'from-red-500 via-red-600 to-red-700';
  } else if (lowerText.includes('niebieski') || lowerText.includes('blue')) {
    modifications.titleColor = 'from-blue-500 via-blue-600 to-blue-700';
  } else if (lowerText.includes('zielony') || lowerText.includes('green')) {
    modifications.titleColor = 'from-green-500 via-green-600 to-green-700';
  } else if (lowerText.includes('żółty') || lowerText.includes('yellow')) {
    modifications.titleColor = 'from-yellow-500 via-yellow-600 to-yellow-700';
  } else if (lowerText.includes('pomarańczowy') || lowerText.includes('orange')) {
    modifications.titleColor = 'from-orange-500 via-orange-600 to-orange-700';
  } else if (lowerText.includes('różowy') || lowerText.includes('pink')) {
    modifications.titleColor = 'from-pink-500 via-pink-600 to-pink-700';
  } else if (lowerText.includes('cyjan') || lowerText.includes('cyan')) {
    modifications.titleColor = 'from-cyan-500 via-cyan-600 to-cyan-700';
  }

  // Tytuł
  const titleMatch = text.match(/tytuł[:\s]+["']([^"']+)["']/i) || 
                     text.match(/title[:\s]+["']([^"']+)["']/i) ||
                     text.match(/zmień\s+tytuł\s+na\s+["']([^"']+)["']/i);
  if (titleMatch) {
    modifications.title = titleMatch[1];
  }

  // Opis
  const descMatch = text.match(/opis[:\s]+["']([^"']+)["']/i) || 
                    text.match(/description[:\s]+["']([^"']+)["']/i) ||
                    text.match(/zmień\s+opis\s+na\s+["']([^"']+)["']/i);
  if (descMatch) {
    modifications.description = descMatch[1];
  }

  // Badge
  const badgeMatch = text.match(/badge[:\s]+["']([^"']+)["']/i) || 
                     text.match(/etykieta[:\s]+["']([^"']+)["']/i);
  if (badgeMatch) {
    modifications.badgeText = badgeMatch[1];
  }

  // Przyciski
  const button1Match = text.match(/pierwszy\s+przycisk[:\s]+["']([^"']+)["']/i) ||
                       text.match(/button\s+1[:\s]+["']([^"']+)["']/i);
  if (button1Match) {
    modifications.button1Text = button1Match[1];
  }

  const button2Match = text.match(/drugi\s+przycisk[:\s]+["']([^"']+)["']/i) ||
                       text.match(/button\s+2[:\s]+["']([^"']+)["']/i);
  if (button2Match) {
    modifications.button2Text = button2Match[1];
  }

  // Rozmiar tytułu
  if (lowerText.includes('większy tytuł') || lowerText.includes('bigger title')) {
    modifications.titleSize = 'text-6xl sm:text-7xl md:text-8xl xl:text-9xl';
  } else if (lowerText.includes('mniejszy tytuł') || lowerText.includes('smaller title')) {
    modifications.titleSize = 'text-3xl sm:text-4xl md:text-5xl';
  }

  // Tło sekcji
  if (lowerText.includes('ciemne tło') || lowerText.includes('dark background')) {
    modifications.sectionBg = 'bg-[#0a0a0a]';
  } else if (lowerText.includes('jasne tło') || lowerText.includes('light background')) {
    modifications.sectionBg = 'bg-gray-900';
  }

  return Object.keys(modifications).length > 0 ? modifications : null;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    console.log('Received request:', { message: message?.substring(0, 50), historyLength: history.length });

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      console.error('GOOGLE_AI_API_KEY is not set');
      return NextResponse.json(
        { error: 'API key not configured. Please set GOOGLE_AI_API_KEY in .env.local' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Wybierz model (gemini-pro lub gemini-1.5-flash dla szybszych odpowiedzi)
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
    });

    // Przygotuj historię konwersacji
    const chatHistory = history
      .filter((msg: any) => msg && msg.role && msg.content)
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: String(msg.content) }]
      }));

    // System prompt dla agenta AI
    const systemPrompt = `Jesteś agentem AI specjalizującym się w modyfikacji interfejsu użytkownika React.
Użytkownik może prosić Cię o zmiany w interfejsie strony AgentAI.

ZAWSZE odpowiadaj TYLKO w formacie JSON (bez dodatkowego tekstu przed lub po):
{
  "response": "Tekstowa odpowiedź dla użytkownika wyjaśniająca co zostało zmienione",
  "action": "modify_code" | "info",
  "modifications": {
    "title": "Nowy tytuł (opcjonalnie)",
    "description": "Nowy opis (opcjonalnie)",
    "titleColor": "from-[color]-500 via-[color]-600 to-[color]-700 (opcjonalnie)",
    "badgeText": "Tekst badge'a (opcjonalnie)",
    "badgeColor": "Klasy Tailwind dla badge'a (opcjonalnie)",
    "sectionBg": "Klasa Tailwind dla tła sekcji (opcjonalnie)",
    "button1Text": "Tekst pierwszego przycisku (opcjonalnie)",
    "button1Color": "Klasy Tailwind dla pierwszego przycisku (opcjonalnie)",
    "button2Text": "Tekst drugiego przycisku (opcjonalnie)",
    "button2Style": "Klasy Tailwind dla drugiego przycisku (opcjonalnie)",
    "titleSize": "Klasy Tailwind dla rozmiaru tytułu (opcjonalnie)",
    "descriptionSize": "Klasy Tailwind dla rozmiaru opisu (opcjonalnie)",
    "borderColor": "Klasa Tailwind dla koloru bordera (opcjonalnie)"
  }
}

DOSTĘPNE MODYFIKACJE:
- title: Zmiana tytułu strony
- description: Zmiana opisu strony  
- titleColor: Zmiana koloru gradientu tytułu (format: from-[color]-500 via-[color]-600 to-[color]-700)
- badgeText: Zmiana tekstu badge'a (np. "AI Agent", "Code Assistant")
- badgeColor: Zmiana stylu badge'a (np. "bg-blue-500/20 border-blue-500/30 text-blue-400")
- sectionBg: Zmiana tła sekcji (np. "bg-gray-900", "bg-[#0a0a0a]")
- button1Text: Zmiana tekstu pierwszego przycisku (np. "KNN", "Demo")
- button1Color: Zmiana koloru pierwszego przycisku (np. "bg-red-500 hover:bg-red-600")
- button2Text: Zmiana tekstu drugiego przycisku (np. "Home", "Back")
- button2Style: Zmiana stylu drugiego przycisku (np. "border border-red-500/50 hover:bg-red-500/10")
- titleSize: Zmiana rozmiaru tytułu (np. "text-3xl sm:text-4xl", "text-6xl")
- descriptionSize: Zmiana rozmiaru opisu (np. "text-base", "text-2xl")
- borderColor: Zmiana koloru bordera (np. "border-red-500", "border-blue-400")

PRZYKŁADY KOLORÓW (dla titleColor):
- Czerwony: "from-red-500 via-red-600 to-red-700"
- Niebieski: "from-blue-500 via-blue-600 to-blue-700"
- Zielony: "from-green-500 via-green-600 to-green-700"
- Żółty: "from-yellow-500 via-yellow-600 to-yellow-700"
- Pomarańczowy: "from-orange-500 via-orange-600 to-orange-700"
- Różowy: "from-pink-500 via-pink-600 to-pink-700"
- Cyjan: "from-cyan-500 via-cyan-600 to-cyan-700"
- Fioletowy (domyślny): "from-[#700B97] via-[#8E05C2] to-white"

PRZYKŁADY ROZMIARÓW:
- Mały tytuł: "text-3xl sm:text-4xl md:text-5xl"
- Średni tytuł: "text-4xl sm:text-5xl md:text-6xl"
- Duży tytuł: "text-5xl sm:text-6xl md:text-7xl xl:text-8xl" (domyślny)
- Bardzo duży: "text-6xl sm:text-7xl md:text-8xl xl:text-9xl"

Jeśli użytkownik prosi o modyfikację, ustaw action: "modify_code" i wypełnij odpowiednie pola w modifications.
Jeśli użytkownik tylko pyta lub rozmawia, ustaw action: "info" i zostaw modifications puste.

WAŻNE: Zawsze zwracaj poprawny JSON, bez dodatkowego tekstu!`;

    // Rozpocznij chat z historią
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: 'Rozumiem. Jestem gotowy pomagać w modyfikacji interfejsu.' }]
        },
        ...chatHistory
      ],
    });

    // Wyślij wiadomość
    console.log('Sending message to Gemini...');
    let result;
    let response;
    let text;
    
    try {
      result = await chat.sendMessage(String(message));
      response = await result.response;
      text = response.text().trim();
      console.log('Received response from Gemini, length:', text.length);
    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError);
      throw new Error(`Gemini API error: ${geminiError.message || 'Unknown error'}`);
    }

    // Spróbuj wyciągnąć JSON z odpowiedzi (może być otoczony markdown code blocks)
    let jsonText = text;
    
    // Usuń markdown code blocks jeśli istnieją
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    } else {
      // Spróbuj znaleźć JSON w tekście
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonText = text.substring(jsonStart, jsonEnd + 1);
      }
    }

    // Spróbuj sparsować JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(jsonText);
    } catch (parseError) {
      // Jeśli parsowanie się nie powiodło, spróbuj naprawić typowe błędy
      try {
        // Usuń trailing commas
        jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1');
        parsedResponse = JSON.parse(jsonText);
      } catch (secondError) {
        // Jeśli nadal nie działa, zwróć jako zwykłą odpowiedź z próbą parsowania tekstowego
        console.warn('Failed to parse JSON response:', text);
        parsedResponse = {
          response: text,
          action: 'info',
          modifications: extractModificationsFromText(text)
        };
      }
    }

    // Walidacja i normalizacja odpowiedzi
    if (!parsedResponse.response) {
      parsedResponse.response = text;
    }
    
    if (!parsedResponse.action) {
      parsedResponse.action = parsedResponse.modifications ? 'modify_code' : 'info';
    }

    // Jeśli są modyfikacje, zwróć je w formacie oczekiwanym przez frontend
    if (parsedResponse.modifications && parsedResponse.action === 'modify_code') {
      // Konwertuj modifications na format kodu dla frontendu
      parsedResponse.code = JSON.stringify(parsedResponse.modifications, null, 2);
      parsedResponse.component = 'AgentAI';
    }

    return NextResponse.json(
      {
        success: true,
        data: parsedResponse
      },
      { headers: corsHeaders }
    );

  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    console.error('Error stack:', error.stack);
    
    // Sprawdź typ błędu
    let errorMessage = 'Failed to process request';
    let errorDetails = error.message || 'Unknown error';
    
    if (error.message?.includes('API key')) {
      errorMessage = 'Invalid API key';
      errorDetails = 'Please check your GOOGLE_AI_API_KEY in .env.local';
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'API quota exceeded';
      errorDetails = 'You have exceeded your API quota. Please check your Google AI Studio account.';
    } else if (error.message?.includes('Gemini')) {
      errorMessage = 'Gemini API error';
      errorDetails = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        type: error.name || 'UnknownError'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

