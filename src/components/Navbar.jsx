import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSite } from "../store/SiteContext";

export default function Navbar() {
  const { content } = useSite();
  const { brandName, brandAccent } = content.settings;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-[8vw] transition-all duration-300 ${
        scrolled ? "glass py-3" : "py-5"
      }`}
    >
      <a href="#home" className="justify-self-start font-display text-2xl font-bold" data-cursor>
        {brandName}
        <span className="text-accent">{brandAccent}</span>
        <span className="text-accent">.</span>
      </a>

      {/* centered floating pill of links */}
      <nav className="hidden justify-self-center rounded-full border border-white/10 bg-bg2/40 px-2 py-1.5 backdrop-blur md:flex md:items-center md:gap-1">
        {content.nav.map((n) => (
          <a
            key={n.href + n.label}
            href={n.href}
            className="rounded-full px-4 py-1.5 text-sm font-medium text-ink/70 transition-colors hover:bg-accent/15 hover:text-accent"
          >
            {n.label}
          </a>
        ))}
      </nav>

      <button
        onClick={() => setOpen((v) => !v)}
        className="justify-self-end text-3xl md:hidden"
        aria-label="Toggle menu"
      >
        <i className={open ? "bx bx-x" : "bx bx-menu"} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute inset-x-0 top-full flex flex-col overflow-hidden bg-bg/95 backdrop-blur md:hidden"
          >
            {content.nav.map((n) => (
              <a
                key={n.href + n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className="border-t border-white/10 px-[8vw] py-4 text-ink/80"
              >
                {n.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
