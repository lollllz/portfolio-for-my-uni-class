import { motion } from "framer-motion";
import { useSite } from "../store/SiteContext";
import SectionHeading from "./SectionHeading";

export default function Services() {
  const { content } = useSite();
  const s = content.services;

  return (
    <section id="services" className="section-pad">
      <SectionHeading title={s.heading} accent={s.headingAccent} sub={s.subheading} />
      <div className="mx-auto grid max-w-6xl gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {s.items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -8 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-bg2 p-8 text-center transition-colors hover:border-accent"
          >
            <div className="absolute inset-x-0 -top-px h-px scale-x-0 bg-gradient-to-r from-transparent via-accent to-transparent transition-transform duration-500 group-hover:scale-x-100" />
            <i className={`${it.icon} text-5xl text-accent`} />
            <h4 className="mt-4 text-xl font-bold">{it.title}</h4>
            <p className="mt-2 text-sm text-ink/60">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
