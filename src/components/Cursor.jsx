import { useEffect, useRef } from "react";

/** Custom trailing cursor (dot + easing ring). Hidden on touch/small screens. */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let raf;

    const move = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${pos.x - 3.5}px, ${pos.y - 3.5}px)`;
    };
    const over = (e) => {
      const interactive = e.target.closest("a, button, input, textarea, select, [data-cursor]");
      if (ring.current) {
        ring.current.style.width = interactive ? "52px" : "34px";
        ring.current.style.height = interactive ? "52px" : "34px";
      }
    };
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (ring.current) {
        const w = parseFloat(ring.current.style.width || "34");
        ring.current.style.transform = `translate(${ringPos.x - w / 2}px, ${ringPos.y - w / 2}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    loop();
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}
