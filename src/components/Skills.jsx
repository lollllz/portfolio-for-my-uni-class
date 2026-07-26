import { motion } from "framer-motion";
import { useSite } from "../store/SiteContext";
import SectionHeading from "./SectionHeading";

export default function Skills() {
  const { content } = useSite();
  const s = content.skills;

  return (
    <section id="skills" className="section-pad bg-bg2">
      <SectionHeading title={s.heading} accent={s.headingAccent} sub={s.subheading} />
      <div className="mx-auto max-w-2xl">
        {s.items.map((sk, i) => {
          const lvl = Math.max(0, Math.min(100, Number(sk.level) || 0));
          return (
            <div key={i} className="mb-6">
              <div className="mb-2 flex justify-between font-semibold">
                <span>{sk.name}</span>
                <span className="text-accent">{lvl}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-bg">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${lvl}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent2"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
