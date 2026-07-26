import { motion } from "framer-motion";
import { useSite } from "../store/SiteContext";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";

export default function About() {
  const { content } = useSite();
  const a = content.about;

  return (
    <section id="about" className="section-pad grid items-center gap-12 bg-bg2 md:grid-cols-2">
      <Reveal dir="right">
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-tr from-accent/40 to-accent2/30 blur-2xl" />
          {a.photo ? (
            <img src={a.photo} alt="" className="aspect-[4/5] w-full rounded-3xl border-2 border-accent object-cover shadow-glow" />
          ) : (
            <div className="grid aspect-[4/5] w-full place-items-center rounded-3xl border-2 border-dashed border-accent/40 text-ink/40">
              Add a photo
            </div>
          )}
        </div>
      </Reveal>

      <Reveal dir="left">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
          {a.heading} <span className="gradient-text">{a.headingAccent}</span>
        </h2>
        <h3 className="mt-3 text-xl font-bold">{a.title}</h3>
        <p className="font-semibold text-accent">{a.subtitle}</p>
        <p className="mt-4 whitespace-pre-line text-ink/65">{a.body}</p>

        {a.stats?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-6">
            {a.stats.map((s, i) => (
              <motion.div key={i} whileHover={{ y: -4 }} className="rounded-xl">
                <div className="font-display text-3xl font-extrabold text-accent">{s.value}</div>
                <div className="text-sm text-ink/55">{s.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {a.ctaLabel && (
          <div className="mt-7">
            <MagneticButton href={a.ctaHref} variant="solid">{a.ctaLabel}</MagneticButton>
          </div>
        )}
      </Reveal>
    </section>
  );
}
