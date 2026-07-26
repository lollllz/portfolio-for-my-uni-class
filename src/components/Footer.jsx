import { motion } from "framer-motion";
import { useSite } from "../store/SiteContext";

export default function Footer() {
  const { content } = useSite();
  const f = content.footer;

  return (
    <footer className="border-t border-white/10 bg-bg2 px-[8vw] py-12 text-center">
      <div className="mb-6 flex justify-center gap-4">
        {f.socials.map((s, i) => (
          <motion.a
            key={i}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -4, scale: 1.12 }}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-lg text-accent transition-colors hover:bg-accent hover:text-black"
          >
            <i className={s.icon} />
          </motion.a>
        ))}
      </div>
      <p className="text-sm text-ink/50">{f.text}</p>
      <a
        href="#home"
        className="mt-6 inline-grid h-11 w-11 place-items-center rounded-xl bg-accent text-2xl text-black shadow-glow"
        aria-label="Back to top"
      >
        <i className="bx bx-up-arrow-alt" />
      </a>
    </footer>
  );
}
