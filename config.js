// ═══════════════════════════════════════════════════════════════
// EB PLATFORM — API CONFIG
// Este archivo no debe ser accesible públicamente si contiene
// valores sensibles. Mantenerlo fuera del repositorio o del
// directorio de assets públicos.
// ═══════════════════════════════════════════════════════════════

const EB_CONFIG = {

  // ── ANTHROPIC / CLAUDE ─────────────────────────────────────
  claude: {
    endpoint : 'https://api.anthropic.com/v1/messages',
    model    : 'claude-sonnet-4-20250514',
    version  : '2023-06-01',
    maxTokens: 2048,
apiKey: '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'
  },

  // ── OPENAI / DALL-E 3 ──────────────────────────────────────
  openai: {
    apiKey  : '',   // ← Pega aquí tu OpenAI API key (sk-...)
    endpoint: 'https://api.openai.com/v1/images/generations',
    model   : 'dall-e-3',
    size    : '1024x1024',
    quality : 'standard',
    style   : 'vivid',
  },

  // ── FIREBASE / FIRESTORE ───────────────────────────────────
  // Obtén estos valores en: Firebase Console → Configuración del proyecto → Tus apps
  firebase: {
    apiKey           : '',   // ← Firebase API key
    authDomain       : '',   // ← ej. mi-proyecto.firebaseapp.com
    projectId        : '',   // ← ej. mi-proyecto
    storageBucket    : '',   // ← ej. mi-proyecto.appspot.com
    messagingSenderId: '',
    appId            : '',
  },

  // ── GOOGLE / VEO 3 ─────────────────────────────────────────
  google: {
    apiKey          : '',   // ← Pega aquí tu Google AI API key (AIza...)
    endpointGenerate: 'https://generativelanguage.googleapis.com/v1beta/models/veo-3.0-generate-preview:predictLongRunning',
    endpointPoll    : 'https://generativelanguage.googleapis.com/v1beta',
    defaultAspect   : '9:16',
    defaultDuration : 8,
    pollInterval    : 8000,   // ms
    maxAttempts     : 30,
  },

};

// EB_FIREBASE_CONFIG se expone por separado para que db.js lo consuma
// sin depender de la estructura interna de EB_CONFIG.
const EB_FIREBASE_CONFIG = EB_CONFIG.firebase;
