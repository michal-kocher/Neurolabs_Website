import { NextResponse } from 'next/server';

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

// Lista dostępnych narzędzi dla agenta AI
const availableTools = [
  {
    id: 'modify_component',
    name: 'Modify Component',
    description: 'Modyfikuje kod komponentu React. Agent może zmieniać style, strukturę, logikę komponentu.',
    parameters: {
      component: 'string - nazwa komponentu (np. Home, AgentAI)',
      changes: 'string - opis zmian do wprowadzenia'
    }
  },
  {
    id: 'read_component',
    name: 'Read Component',
    description: 'Czyta aktualny kod komponentu React.',
    parameters: {
      component: 'string - nazwa komponentu do odczytania'
    }
  },
  {
    id: 'analyze_structure',
    name: 'Analyze Structure',
    description: 'Analizuje strukturę projektu i dostępne komponenty.',
    parameters: {}
  },
  {
    id: 'export_config',
    name: 'Export Configuration',
    description: 'Eksportuje konfigurację zmian jako JSON.',
    parameters: {}
  }
];

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      tools: availableTools,
      version: '1.0.0'
    },
    { headers: corsHeaders }
  );
}

