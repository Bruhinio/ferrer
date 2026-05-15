// EB Platform — Configuración de APIs
// La API key de Claude se guarda en localStorage desde el perfil de la app
// Nunca pongas una API key directamente aquí si subes el archivo a GitHub

const EB_CONFIG = {

  // ── Claude (Anthropic) ──────────────────────────────────────
  claude: {
    endpoint  : 'https://api.anthropic.com/v1/messages',
    version   : '2023-06-01',
    model     : 'claude-opus-4-5',
    maxTokens : 4096,
    // La API key se lee de localStorage: clave 'eb_claude_key'
    // Configúrala desde el panel de perfil (ícono de usuario abajo izquierda)
    get apikey() {
      return localStorage.getItem('eb_claude_key') || '';
    }
  },

  // ── OpenAI (DALL-E 3 para imágenes) ─────────────────────────
  openai: {
    get apiKey() {
      return localStorage.getItem('eb_openai_key') || '';
    },
    endpoint : 'https://api.openai.com/v1/images/generations',
    model    : 'dall-e-3',
    size     : '1024x1024',
    style    : 'vivid',
    quality  : 'standard',
  },

  // ── Google AI (Veo 3 para videos) ───────────────────────────
  google: {
    get apiKey() {
      return localStorage.getItem('eb_google_key') || '';
    },
    endpointGenerate: 'https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT/locations/us-central1/publishers/google/models/veo-3.0-generate-preview:predictLongRunning',
    endpointPoll    : 'https://us-central1-aiplatform.googleapis.com/v1',
    defaultAspect   : '16:9',
    defaultDuration : 8,
    maxAttempts     : 30,
    pollInterval    : 8000,
  },

};
