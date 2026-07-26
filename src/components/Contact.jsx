import { useState } from "react";
import { useSite } from "../store/SiteContext";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";

function Info({ icon, label, value, href }) {
  const inner = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 text-xl text-accent">
        <i className={icon} />
      </span>
      <span>
        <small className="block text-ink/50">{label}</small>
        <span className="font-medium">{value}</span>
      </span>
    </>
  );
  return href ? (
    <a href={href} className="flex items-center gap-4 transition-colors hover:text-accent">{inner}</a>
  ) : (
    <div className="flex items-center gap-4">{inner}</div>
  );
}

export default function Contact() {
  const { content } = useSite();
  const c = content.contact;
  const [sent, setSent] = useState(false);

  function onSubmit(e) {
    if (c.formAction) return; // let it POST normally
    e.preventDefault();
    const d = new FormData(e.target);
    const body = `Name: ${d.get("name")}%0D%0AEmail: ${d.get("email")}%0D%0A%0D%0A${d.get("message") || ""}`;
    window.location.href = `mailto:${c.email}?subject=${encodeURIComponent(d.get("subject") || "Website enquiry")}&body=${body}`;
    setSent(true);
  }

  return (
    <section id="contact" className="section-pad">
      <SectionHeading title={c.heading} accent={c.headingAccent} sub={c.subheading} />
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
        <Reveal dir="right" className="flex flex-col justify-center gap-6">
          <Info icon="bx bx-envelope" label="Email" value={c.email} href={`mailto:${c.email}`} />
          <Info icon="bx bx-phone" label="Phone" value={c.phone} href={`tel:${String(c.phone).replace(/\s/g, "")}`} />
          <Info icon="bx bx-map" label="Location" value={c.location} />
        </Reveal>

        {c.formEnabled && (
          <Reveal dir="left">
            <form
              onSubmit={onSubmit}
              action={c.formAction || undefined}
              method={c.formAction ? "POST" : undefined}
              className="grid gap-4"
            >
              <input name="name" required placeholder="Your Name" className="rounded-xl border border-white/10 bg-bg2 px-4 py-3 outline-none focus:border-accent" />
              <input name="email" type="email" required placeholder="Your Email" className="rounded-xl border border-white/10 bg-bg2 px-4 py-3 outline-none focus:border-accent" />
              <input name="subject" placeholder="Subject" className="rounded-xl border border-white/10 bg-bg2 px-4 py-3 outline-none focus:border-accent" />
              <textarea name="message" required rows={5} placeholder="Your Message" className="resize-y rounded-xl border border-white/10 bg-bg2 px-4 py-3 outline-none focus:border-accent" />
              <MagneticButton as="button" type="submit" variant="solid" className="justify-center">
                {sent ? "Opening mail…" : "Send Message"} <i className="bx bx-paper-plane" />
              </MagneticButton>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
