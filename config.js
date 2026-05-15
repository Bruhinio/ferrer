// EB Platform — Configuración de APIs
// Edita este archivo para conectar tus APIs reales

const EB_CONFIG = {

  // ── Claude (Anthropic) ──────────────────────────────────────
  claude: {
    endpoint  : 'https://api.anthropic.com/v1/messages',
    version   : '2023-06-01',
    model     : 'claude-opus-4-5',
    maxTokens : 4096,
    apikey    : '',  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

  },

  // ── OpenAI (DALL-E 3 para imágenes) ─────────────────────────
  openai: {
    apiKey   : '',   // Pega tu API key de OpenAI aquí
    endpoint : 'https://api.openai.com/v1/images/generations',
    model    : 'dall-e-3',
    size     : '1024x1024',
    style    : 'vivid',
    quality  : 'standard',
  },

  // ── Google AI (Veo 3 para videos) ───────────────────────────
  google: {
    apiKey          : '',   // Pega tu API key de Google AI aquí
    endpointGenerate: 'https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT/locations/us-central1/publishers/google/models/veo-3.0-generate-preview:predictLongRunning',
    endpointPoll    : 'https://us-central1-aiplatform.googleapis.com/v1',
    defaultAspect   : '16:9',
    defaultDuration : 8,
    maxAttempts     : 30,
    pollInterval    : 8000,
  },

};
