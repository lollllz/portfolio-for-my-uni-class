import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSite } from "../store/SiteContext";
import MagneticButton from "./MagneticButton";
import GlobeHero from "./Globe";

function useTyping(words) {
  const [text, setText] = useState("");
  useEffect(() => {
    const list = (words || []).filter(Boolean);
    if (!list.length) { setText(""); return; }
    let ri = 0, ci = 0, deleting = false, timer;
    const tick = () => {
      const word = list[ri % list.length];
      ci += deleting ? -1 : 1;
      setText(word.slice(0, ci));
      let delay = deleting ? 55 : 110;
      if (!deleting && ci === word.length) { delay = 1400; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; ri++; delay = 300; }
      timer = setTimeout(tick, delay);
    };
    tick();
    return () => clearTimeout(timer);
  }, [JSON.stringify(words)]);
  return text;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const { content } = useSite();
  const h = content.hero;
  const showGlobe = content.settings.globe;
  const typed = useTyping(h.roles);

  const nameParts = h.name.trim().split(" ");
  const last = nameParts.pop();

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center gap-10 overflow-hidden px-[8vw] pb-16 pt-32 md:grid md:grid-cols-2"
    >
      {/* ambient accent glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-[60vh] w-[60vh] -translate-y-1/4 translate-x-1/4 rounded-full bg-accent/20 blur-[120px]" />

      {/* background globe — rises from the bottom, only its top half shows, behind everything */}
      {showGlobe && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex translate-y-[60%] justify-center opacity-70">
          <div className="animate-floaty">
            <GlobeHero cap={1600} className="w-[135vw] max-w-[1600px]" />
          </div>
        </div>
      )}

      {/* legibility scrim so hero text stays crisp over the bright globe */}
      {showGlobe && (
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-bg via-bg/70 to-transparent md:via-bg/40" />
      )}

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10">
        <motion.p variants={item} className="font-medium text-ink/60">
          {h.greeting}
        </motion.p>
        <motion.h1 variants={item} className="my-2 font-display text-5xl font-extrabold leading-tight md:text-6xl">
          {nameParts.join(" ")} <span className="gradient-text">{last}</span>
        </motion.h1>
        <motion.p variants={item} className="text-2xl font-bold md:text-3xl">
          {h.intro}{" "}
          <span className="gradient-text">{typed}</span>
          <span className="ml-0.5 inline-block w-0.5 animate-pulse bg-accent align-middle" style={{ height: "1em" }} />
        </motion.p>
        <motion.p variants={item} className="mt-5 max-w-xl text-ink/65">
          {h.bio}
        </motion.p>

        <motion.div variants={item} className="mt-7 flex flex-wrap gap-4">
          {h.ctaLabel && (
            <MagneticButton href={h.ctaHref} variant="solid">
              {h.ctaLabel} <i className="bx bx-right-arrow-alt text-lg" />
            </MagneticButton>
          )}
          {h.secondaryLabel && (
            <MagneticButton href={h.secondaryHref} variant="ghost">
              {h.secondaryLabel}
            </MagneticButton>
          )}
        </motion.div>

        <motion.div variants={item} className="mt-8 flex gap-4">
          {h.socials.map((s, i) => (
            <motion.a
              key={i}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -4, scale: 1.12 }}
              className="grid h-11 w-11 place-items-center rounded-full border-2 border-accent text-xl text-accent transition-colors hover:bg-accent hover:text-black"
            >
              <i className={s.icon} />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 mt-10 flex justify-center md:mt-0"
      >
        <div className="animate-floaty relative">
          <div className="absolute -inset-4 -z-10 rounded-full bg-gradient-to-tr from-accent/40 to-accent2/30 blur-2xl" />
          {h.photo ? (
            <img
              src={h.photo}
              alt={h.name}
              className="aspect-square w-[min(380px,70vw)] rounded-full border-[3px] border-accent object-cover shadow-glow"
            />
          ) : (
            <div className="grid aspect-square w-[min(380px,70vw)] place-items-center rounded-full border-2 border-dashed border-accent/50 bg-bg2/60 text-center text-sm text-ink/50 backdrop-blur-sm">
              Add your photo<br />(Hero → Photo URL)
            </div>
          )}
        </div>
      </motion.div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-ink/40 md:flex"
      >
        <span className="text-xs">Scroll</span>
        <i className="bx bx-chevron-down animate-bounce text-2xl" />
      </a>
    </section>
  );
}
