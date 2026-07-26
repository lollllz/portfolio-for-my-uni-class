import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { defaultContent, CONTENT_VERSION } from "../content/defaultContent";

const LS_KEY = "portfolio.content.v1";
const LS_VER = "portfolio.version.v1";

const SiteContext = createContext(null);

function deepMerge(base, over) {
  if (Array.isArray(base)) return Array.isArray(over) ? over : base;
  if (base && typeof base === "object") {
    const out = {};
    for (const k in base) out[k] = deepMerge(base[k], over ? over[k] : undefined);
    if (over) for (const k in over) if (!(k in base)) out[k] = over[k];
    return out;
  }
  return over === undefined ? base : over;
}
const clone = (o) => JSON.parse(JSON.stringify(o));

function loadInitial() {
  try {
    const ver = +localStorage.getItem(LS_VER);
    const raw = localStorage.getItem(LS_KEY);
    if (raw && ver === CONTENT_VERSION) return deepMerge(defaultContent, JSON.parse(raw));
  } catch (e) {}
  return clone(defaultContent);
}

export function SiteProvider({ children }) {
  const [content, setContent] = useState(loadInitial);
  const [published, setPublished] = useState(null); // content.json, if present

  // Try to load published content.json once (used when no local edits exist).
  useEffect(() => {
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}content.json`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!alive || !json) return;
        setPublished(json);
        const hasLocal = localStorage.getItem(LS_KEY);
        if (!hasLocal) setContent(deepMerge(defaultContent, json));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const save = useCallback((next) => {
    setContent(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      localStorage.setItem(LS_VER, String(CONTENT_VERSION));
    } catch (e) {}
  }, []);

  const reset = useCallback(() => {
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    setContent(clone(published ? deepMerge(defaultContent, published) : defaultContent));
  }, [published]);

  return (
    <SiteContext.Provider value={{ content, save, reset }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
