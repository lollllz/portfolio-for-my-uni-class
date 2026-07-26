import { useEffect } from "react";
import { useSite } from "../store/SiteContext";

function hexToTriplet(hex) {
  if (!hex) return null;
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return null;
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export default function ThemeApplier() {
  const { content } = useSite();
  const t = content.settings.theme;

  useEffect(() => {
    const root = document.documentElement;
    const map = {
      "--c-bg": t.bg, "--c-bg2": t.bg2, "--c-text": t.text,
      "--c-accent": t.accent, "--c-accent2": t.accent2,
    };
    for (const k in map) {
      const trip = hexToTriplet(map[k]);
      if (trip) root.style.setProperty(k, trip);
    }
    if (t.fontDisplay) root.style.setProperty("--font-display", `"${t.fontDisplay}"`);
    if (t.fontBody) root.style.setProperty("--font-body", `"${t.fontBody}"`);
  }, [t.bg, t.bg2, t.text, t.accent, t.accent2, t.fontDisplay, t.fontBody]);

  // owner custom CSS (managed <style>)
  useEffect(() => {
    let el = document.getElementById("site-custom-css");
    if (!el) {
      el = document.createElement("style");
      el.id = "site-custom-css";
      document.head.appendChild(el);
    }
    el.textContent = content.settings.customCss || "";
  }, [content.settings.customCss]);

  return null;
}

export { hexToTriplet };
