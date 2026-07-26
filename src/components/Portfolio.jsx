import { motion } from "framer-motion";
import { useSite } from "../store/SiteContext";
import SectionHeading from "./SectionHeading";

export default function Portfolio() {
  const { content } = useSite();
  const p = content.portfolio;

  return (
    <section id="portfolio" className="section-pad">
      <SectionHeading title={p.heading} accent={p.headingAccent} sub={p.subheading} />
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {p.items.map((it, i) => (
          <motion.a
            key={i}
            href={it.href || "#"}
            target={it.href && it.href !== "#" ? "_blank" : undefined}
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-bg2"
            data-cursor
          >
            {it.image ? (
              <img
                src={it.image}
                alt={it.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-ink/40">
                <i className="bx bx-image text-4xl" />
              </div>
            )}
            <div className="absolute inset-0 flex translate-y-4 flex-col items-center justify-center gap-1 bg-gradient-to-t from-accent via-accent/80 to-accent/40 p-6 text-center text-black opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {it.tag && <span className="text-xs font-bold uppercase tracking-wider opacity-80">{it.tag}</span>}
              <h4 className="text-xl font-extrabold">{it.title}</h4>
              <p className="text-sm font-medium">{it.desc}</p>
              <span className="mt-2 grid h-11 w-11 place-items-center rounded-full bg-black text-xl text-accent">
                <i className="bx bx-link-external" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
