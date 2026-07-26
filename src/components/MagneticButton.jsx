import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * A "reactive" button that leans toward the cursor (magnetic pull) and springs
 * back on leave. Use variant="solid" (accent) or "ghost" (outline).
 */
export default function MagneticButton({
  as = "a",
  variant = "solid",
  strength = 0.4,
  className = "",
  children,
  ...props
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 15, mass: 0.4 });
  // content leans a little more than the shell for depth
  const tx = useTransform(sx, (v) => v * 1.35);
  const ty = useTransform(sy, (v) => v * 1.35);

  function onMove(e) {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function onLeave() { x.set(0); y.set(0); }

  const base =
    "btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold cursor-pointer select-none";
  const styles =
    variant === "solid"
      ? "bg-accent text-black shadow-glow"
      : "border-2 border-accent text-ink hover:bg-accent hover:text-black transition-colors";

  const MotionTag = motion[as] || motion.a;

  return (
    <MotionTag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.94 }}
      className={`${base} ${styles} ${className}`}
      {...props}
    >
      <motion.span style={{ x: tx, y: ty }} className="inline-flex items-center gap-2">
        {children}
      </motion.span>
    </MotionTag>
  );
}
