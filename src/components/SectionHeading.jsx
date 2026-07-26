import Reveal from "./Reveal";

export default function SectionHeading({ title, accent, sub }) {
  return (
    <Reveal className="mb-14 text-center">
      <h2 className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">
        {title} <span className="gradient-text">{accent}</span>
      </h2>
      {sub && <p className="mt-3 text-ink/60">{sub}</p>}
      <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-accent" />
    </Reveal>
  );
}
