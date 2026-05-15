/**
 * db.js — Capa de persistencia Firebase Firestore
 * ═══════════════════════════════════════════════════════════════
 * Reemplaza localStorage para sincronización multi-dispositivo.
 *
 * Requiere que los siguientes scripts se carguen ANTES que éste:
 *   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
 *   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
 *
 * Y que config.js defina: window.EB_FIREBASE_CONFIG = { apiKey, authDomain, projectId, ... }
 *
 * API expuesta como window.DB:
 *   DB.get(key)           → Promise<value | null>
 *   DB.set(key, value)    → Promise<void>  (también escribe en localStorage como caché)
 *   DB.remove(key)        → Promise<void>
 *   DB.removeMany(keys[]) → Promise<void>
 *   DB.isReady()          → boolean
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ── Colección principal en Firestore ────────────────────────
  const COLLECTION = 'eb_platform';

  // ── ID de "tenant" — un ID fijo por instancia del sitio.
  //    Si quieres multi-usuario real, cámbialo por un auth UID.
  const TENANT_ID = 'default';

  let _db    = null;
  let _ready = false;

  // ── Inicialización ─────────────────────────────────────────
  function init() {
    try {
      if (!window.EB_FIREBASE_CONFIG) {
        console.warn('[DB] EB_FIREBASE_CONFIG no definido — usando sólo localStorage.');
        return;
      }
      if (!firebase.apps.length) {
        firebase.initializeApp(window.EB_FIREBASE_CONFIG);
      }
      _db    = firebase.firestore();
      _ready = true;
      console.log('[DB] ✓ Firebase Firestore conectado.');
    } catch (e) {
      console.warn('[DB] Error al iniciar Firebase:', e.message, '— se usará sólo localStorage.');
    }
  }

  // ── Referencia a un documento ──────────────────────────────
  function _ref(key) {
    // Estructura: eb_platform / default / data / <key>
    return _db.collection(COLLECTION).doc(TENANT_ID).collection('data').doc(key);
  }

  // ── GET ───────────────────────────────────────────────────
  async function get(key) {
    if (_ready && _db) {
      try {
        const snap = await _ref(key).get();
        if (snap.exists) {
          return snap.data().value ?? null;
        }
        // Documento no existe en Firestore — puede haber datos en localStorage
      } catch (e) {
        console.warn(`[DB] Error leyendo "${key}" de Firestore:`, e.message);
      }
    }
    // Fallback: localStorage
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // ── SET ───────────────────────────────────────────────────
  async function set(key, value) {
    // 1. Siempre escribe en localStorage como caché local instantáneo
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}

    // 2. Escribe en Firestore en segundo plano
    if (_ready && _db) {
      try {
        await _ref(key).set({ value, updatedAt: new Date().toISOString() });
      } catch (e) {
        console.warn(`[DB] Error guardando "${key}" en Firestore:`, e.message);
      }
    }
  }

  // ── REMOVE ────────────────────────────────────────────────
  async function remove(key) {
    try { localStorage.removeItem(key); } catch {}
    if (_ready && _db) {
      try { await _ref(key).delete(); } catch (e) {
        console.warn(`[DB] Error eliminando "${key}" de Firestore:`, e.message);
      }
    }
  }

  // ── REMOVE MANY ───────────────────────────────────────────
  async function removeMany(keys) {
    await Promise.all(keys.map(k => remove(k)));
  }

  // ── LISTENER EN TIEMPO REAL (opcional) ────────────────────
  // Retorna la función de "unsubscribe". Llama a callback(value) cada vez
  // que el valor cambie en Firestore desde OTRO dispositivo/pestaña.
  function onSnapshot(key, callback) {
    if (!_ready || !_db) return () => {};
    return _ref(key).onSnapshot(snap => {
      if (snap.exists) callback(snap.data().value ?? null);
    }, err => console.warn(`[DB] onSnapshot "${key}":`, err.message));
  }

  // ── API pública ────────────────────────────────────────────
  window.DB = { get, set, remove, removeMany, onSnapshot, isReady: () => _ready };

  init();
})();
