import { useEffect, useRef } from "react";
import Globe from "globe.gl";
import { AmbientLight, DirectionalLight } from "three";

// Read a "--c-*" triplet ("234 88 12") from CSS and return an rgba() string.
function cssColor(varName, alpha = 1) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const parts = raw.split(/\s+/).map(Number);
  if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
    return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
  }
  return `rgba(234, 88, 12, ${alpha})`;
}

// A few illustrative arcs radiating from a home point (KL-ish).
const HOME = { lat: 3.14, lng: 101.69 };
const TARGETS = [
  { lat: 40.71, lng: -74.0 },   // New York
  { lat: 51.51, lng: -0.13 },   // London
  { lat: 35.68, lng: 139.69 },  // Tokyo
  { lat: -33.87, lng: 151.21 }, // Sydney
  { lat: 1.35, lng: 103.82 },   // Singapore
  { lat: 37.77, lng: -122.42 }, // San Francisco
];

export default function GlobeHero({ cap = 460, className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let globe;
    let disposed = false;

    const accent = cssColor("--c-accent", 1);
    const accentSoft = cssColor("--c-accent", 0.95);
    const accent2 = cssColor("--c-accent2", 1);

    const arcs = TARGETS.map((t) => ({
      startLat: HOME.lat, startLng: HOME.lng, endLat: t.lat, endLng: t.lng,
    }));
    const rings = [HOME, ...TARGETS].map((p) => ({ lat: p.lat, lng: p.lng }));

    fetch(`${import.meta.env.BASE_URL}countries.geojson`)
      .then((r) => r.json())
      .then((geo) => {
        if (disposed || !mount) return;
        const size = Math.min(mount.clientWidth || 420, cap);

        globe = Globe()(mount)
          .width(size)
          .height(size)
          .backgroundColor("rgba(0,0,0,0)")
          .showGlobe(true)
          .showAtmosphere(true)
          .atmosphereColor(accent)
          .atmosphereAltitude(0.22);

        const mat = globe.globeMaterial();
        if (mat?.color) mat.color.set("#0a0a0a");
        if (mat?.emissive) mat.emissive.set("#050505");

        // brighter lighting so the country-dots read against the dark globe
        const dir = new DirectionalLight(0xffffff, 1.2);
        dir.position.set(1, 1, 1);
        globe.lights([new AmbientLight(0xffffff, 2.6), dir]);

        globe
          .hexPolygonsData(geo.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.15)
          .hexPolygonAltitude(0.007)
          .hexPolygonUseDots(true)
          .hexPolygonColor(() => accentSoft);

        globe
          .arcsData(arcs)
          .arcColor(() => [accent, accent2])
          .arcAltitude(0.28)
          .arcStroke(0.5)
          .arcDashLength(0.5)
          .arcDashGap(1.2)
          .arcDashInitialGap(() => Math.random() * 2)
          .arcDashAnimateTime(2600);

        globe
          .ringsData(rings)
          .ringColor(() => (t) => cssColor("--c-accent", 1 - t))
          .ringMaxRadius(4)
          .ringPropagationSpeed(2.4)
          .ringRepeatPeriod(1400);

        const controls = globe.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.6;
        controls.enableZoom = false;
        controls.enablePan = false;
        globe.pointOfView({ lat: 18, lng: 60, altitude: 1.85 });

        const onResize = () => {
          const s = Math.min(mount.clientWidth || 420, cap);
          globe.width(s).height(s);
        };
        window.addEventListener("resize", onResize);
        mount._cleanupResize = onResize;
      })
      .catch((e) => console.error("[Globe] setup failed:", e));

    return () => {
      disposed = true;
      if (mount?._cleanupResize) window.removeEventListener("resize", mount._cleanupResize);
      try { globe && globe._destructor && globe._destructor(); } catch (e) {}
      if (mount) mount.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`mx-auto aspect-square w-full [&_canvas]:!outline-none ${className}`}
      style={{ maxWidth: cap }}
      aria-hidden="true"
    />
  );
}
