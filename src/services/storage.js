// Thin wrapper around localStorage.
//
// Every other service file reads/writes exclusively through this module.
// When the project migrates to Supabase, only the functions in this file
// (and the individual `*Service.js` files that call it) need to change —
// components never touch localStorage directly.

const NAMESPACE = 'uniassist';

const key = (name) => `${NAMESPACE}:${name}`;

export function readCollection(name, fallback = []) {
  try {
    const raw = localStorage.getItem(key(name));
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[storage] failed to read "${name}"`, err);
    return fallback;
  }
}

export function writeCollection(name, value) {
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[storage] failed to write "${name}"`, err);
    return false;
  }
}

export function readValue(name, fallback = null) {
  try {
    const raw = localStorage.getItem(key(name));
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[storage] failed to read "${name}"`, err);
    return fallback;
  }
}

export function writeValue(name, value) {
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[storage] failed to write "${name}"`, err);
    return false;
  }
}

export function removeValue(name) {
  try {
    localStorage.removeItem(key(name));
  } catch (err) {
    console.error(`[storage] failed to remove "${name}"`, err);
  }
}

export function seedIfEmpty(name, seedValue) {
  const existing = localStorage.getItem(key(name));
  if (existing === null) {
    writeCollection(name, seedValue);
    return seedValue;
  }
  try {
    return JSON.parse(existing);
  } catch {
    writeCollection(name, seedValue);
    return seedValue;
  }
}

// A tiny pub/sub so that pages relying on "shared" collections (reports,
// lost & found, announcements) can re-render when another part of the app
// — e.g. an admin action — changes the underlying data in the same tab.
const listeners = new Set();

export function onStorageChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function notifyChange(name) {
  listeners.forEach((cb) => cb(name));
}
