# 🚀 Guía de Despliegue — EB Platform + Ferretería Aguilar

Esta guía te lleva del ZIP a un sitio en producción en ~20 minutos.

---

## Archivos del proyecto

```
eb-platform-v2.html     ← plataforma de edición (editor)
ferreteria-aguilar.html ← tienda (iframe dentro del editor)
config.js               ← llaves de API (Anthropic, OpenAI, Google, Firebase)
db.js                   ← capa de base de datos (NO editar)
prompts.js              ← prompts de los agentes (NO editar)
```

---

## Paso 1 — Crear el proyecto Firebase

1. Ve a **https://console.firebase.google.com** e inicia sesión con tu cuenta de Google.
2. Haz clic en **"Agregar proyecto"**.
   - Nombre: `eb-platform` (o el que prefieras)
   - Google Analytics: opcional, puedes desactivarlo.
3. Una vez creado, en el panel lateral ve a **Compilación → Firestore Database**.
4. Haz clic en **"Crear base de datos"**.
   - Selecciona **"Comenzar en modo de prueba"** (permite lectura/escritura 30 días).
   - Elige la región más cercana a México: `nam5 (us-central)` o `us-east1`.
   - Haz clic en **Habilitar**.

> **Seguridad (importante después de las pruebas):** Las reglas en "modo prueba" expiran
> en 30 días. Antes de que expiren, ve a **Firestore → Reglas** y pega estas reglas:
>
> ```
> rules_version = '2';
> service cloud.firestore {
>   match /databases/{database}/documents {
>     match /eb_platform/{document=**} {
>       allow read, write: if true;  // Acceso público — cambia si añades auth
>     }
>   }
> }
> ```

---

## Paso 2 — Obtener las credenciales de Firebase

1. En Firebase Console, haz clic en el ícono de engranaje (⚙) → **Configuración del proyecto**.
2. Baja hasta **"Tus apps"** y haz clic en el ícono `</>` (Web).
3. Registra la app con el nombre `eb-platform-web`.
4. Firebase te mostrará un bloque `firebaseConfig`. Cópialo, se ve así:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "mi-proyecto.firebaseapp.com",
  projectId: "mi-proyecto",
  storageBucket: "mi-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

## Paso 3 — Configurar `config.js`

Abre `config.js` y llena el bloque `firebase` con tus valores:

```js
firebase: {
  apiKey           : 'AIzaSy...',
  authDomain       : 'mi-proyecto.firebaseapp.com',
  projectId        : 'mi-proyecto',
  storageBucket    : 'mi-proyecto.appspot.com',
  messagingSenderId: '123456789',
  appId            : '1:123456789:web:abcdef',
},
```

También llena las otras llaves que uses:

```js
claude: {
  // El endpoint y modelo ya están configurados; sólo asegúrate de tener
  // tu API key de Anthropic disponible (se configura en el perfil de la plataforma)
},
openai: {
  apiKey: 'sk-...',   // Si usas generación de imágenes DALL-E
},
google: {
  apiKey: 'AIza...',  // Si usas generación de video Veo 3
},
```

---

## Paso 4 — Desplegar el sitio

### Opción A — Firebase Hosting (recomendada, gratis)

Firebase Hosting sirve archivos estáticos con HTTPS y CDN global.

**Instala Firebase CLI (necesitas Node.js ≥ 18):**
```bash
npm install -g firebase-tools
firebase login
```

**Inicializa el proyecto:**
```bash
# Dentro de la carpeta del proyecto
firebase init hosting
```
- "What do you want to use as your public directory?" → `.` (punto, la carpeta actual)
- "Configure as a single-page app?" → `No`
- "Set up automatic builds with GitHub?" → `No`
- "File ./index.html already exists. Overwrite?" → `No`

**Sube el sitio:**
```bash
firebase deploy --only hosting
```

Al terminar verás una URL tipo `https://mi-proyecto.web.app` — ¡listo!

---

### Opción B — Netlify Drop (sin instalar nada)

1. Ve a **https://app.netlify.com/drop**
2. Arrastra la carpeta completa del proyecto al área de drop.
3. Netlify genera una URL automáticamente.

> ⚠️ Netlify no tiene reglas de reescritura especiales para este proyecto, funciona directo.

---

### Opción C — Vercel (también gratis)

1. Instala Vercel CLI: `npm i -g vercel`
2. Dentro de la carpeta del proyecto: `vercel`
3. Acepta los valores por defecto.

---

### Opción D — Servidor propio / VPS

Sirve la carpeta como archivos estáticos con cualquier servidor web:

**Nginx (ejemplo):**
```nginx
server {
    listen 80;
    server_name tudominio.com;
    root /var/www/eb-platform;
    index eb-platform-v2.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

**Python (desarrollo local rápido):**
```bash
python3 -m http.server 8080
# Abre: http://localhost:8080/eb-platform-v2.html
```

---

## Paso 5 — Verificar que la base de datos funciona

1. Abre la plataforma en el navegador.
2. Haz algún cambio (ej. cambia un color, agrega un producto).
3. Ve a **Firebase Console → Firestore Database**.
4. Deberías ver la colección `eb_platform` con documentos creados.
5. Abre la misma URL en otro navegador o dispositivo — los cambios deben aparecer.

---

## Cómo funciona la sincronización

```
┌─────────────┐     postMessage     ┌──────────────────────┐
│ EB Platform │ ──────────────────▶ │ Ferretería Aguilar   │
│ (editor)    │                     │ (iframe)             │
└──────┬──────┘                     └──────────┬───────────┘
       │                                        │
       │ DB.set(key, value)                     │ DB.set(key, value)
       ▼                                        ▼
  localStorage ──────────────────────────── localStorage
  (caché local)                              (caché local)
       │                                        │
       └──────────────┬─────────────────────────┘
                      ▼
              Firebase Firestore
              (persistencia global)
```

- **Sin conexión:** los cambios se guardan en `localStorage` y se sincronizan cuando vuelve internet.
- **Múltiples dispositivos:** cada cambio guardado en Firestore está disponible en todos los dispositivos al recargar.

---

## Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| Los cambios no se guardan en Firestore | `config.js` sin credenciales Firebase | Verifica el bloque `firebase` en `config.js` |
| Error `Firebase: No Firebase App` en consola | `db.js` cargado antes de `config.js` | Verifica el orden de los `<script>` |
| Error de CORS al cargar localmente | Abrir archivos como `file://` | Usa un servidor local (`python3 -m http.server`) |
| El iframe no carga `ferreteria-aguilar.html` | Ruta incorrecta | Asegúrate de que ambos HTML están en la misma carpeta |
| Reglas de Firestore expiradas | Modo prueba de 30 días vencido | Actualiza las reglas en Firebase Console |

---

## Límites del plan gratuito de Firebase (Spark)

| Recurso | Límite gratuito |
|---|---|
| Lecturas de Firestore | 50,000 / día |
| Escrituras de Firestore | 20,000 / día |
| Almacenamiento | 1 GB |
| Hosting (transferencia) | 10 GB / mes |

Para una ferretería típica, estos límites son más que suficientes.
