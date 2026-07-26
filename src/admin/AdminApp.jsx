import { useState } from "react";
import { useSite } from "../store/SiteContext";
import { defaultContent } from "../content/defaultContent";
import { Text, Area, Num, Color, Check, Select } from "./fields";
import ListEditor from "./ListEditor";

const PASS_KEY = "portfolio.pass.v1";
const DEFAULT_PASS = "kamiladminkerja2026";
const getPass = () => { try { return localStorage.getItem(PASS_KEY) || DEFAULT_PASS; } catch { return DEFAULT_PASS; } };

const TABS = [
  ["site", "bx-globe", "Site"],
  ["nav", "bx-menu", "Navigation"],
  ["hero", "bx-user", "Hero"],
  ["about", "bx-id-card", "About"],
  ["services", "bx-briefcase", "Services"],
  ["skills", "bx-bar-chart-alt-2", "Skills"],
  ["portfolio", "bx-images", "Portfolio"],
  ["contact", "bx-envelope", "Contact"],
  ["footer", "bx-copyright", "Footer"],
  ["theme", "bx-palette", "Theme"],
  ["advanced", "bx-code-block", "Advanced"],
];

const FONTS = ["Poppins", "Inter", "Montserrat", "Nunito", "Roboto", "system-ui"];

export default function AdminApp() {
  const { content, save, reset } = useSite();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("portfolio.authed") === "1");
  const [tab, setTab] = useState("site");
  const [flash, setFlash] = useState("");

  const c = content;
  // Immutable path setter -> autosave to context + localStorage.
  const set = (path, value) => {
    const next = structuredClone(c);
    const keys = path.split(".");
    let t = next;
    for (let i = 0; i < keys.length - 1; i++) t = t[keys[i]];
    t[keys[keys.length - 1]] = value;
    save(next);
  };
  const ping = (msg) => { setFlash(msg); setTimeout(() => setFlash(""), 2200); };

  if (!authed) return <Gate onOk={() => { sessionStorage.setItem("portfolio.authed", "1"); setAuthed(true); }} />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" style={{ "--admin-accent": c.settings.theme.accent }}>
      <div className="grid grid-cols-[240px_1fr] max-md:grid-cols-1">
        {/* sidebar */}
        <aside className="sticky top-0 flex h-screen flex-col border-r border-slate-800 bg-slate-900 max-md:static max-md:h-auto">
          <div className="border-b border-slate-800 p-5">
            <h1 className="text-lg font-bold">Portfolio CMS</h1>
            <p className="text-xs text-slate-400">Edit your site content</p>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-2">
            {TABS.map(([id, icon, name]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm ${
                  tab === id ? "bg-accent font-semibold text-black" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <i className={`bx ${icon} text-lg`} /> {name}
              </button>
            ))}
          </nav>
          <div className="space-y-2 border-t border-slate-800 p-3">
            <a href="#/" className="block rounded-lg border border-slate-700 py-2 text-center text-sm hover:bg-slate-800">↗ View site</a>
            <button onClick={() => { sessionStorage.removeItem("portfolio.authed"); setAuthed(false); }} className="w-full rounded-lg border border-slate-700 py-2 text-sm hover:bg-slate-800">Log out</button>
          </div>
        </aside>

        {/* main */}
        <main className="max-h-screen overflow-y-auto p-8 max-md:p-5">
          <div className="mx-auto max-w-3xl">
            <Panel tab={tab} c={c} set={set} save={save} reset={reset} ping={ping} />
          </div>
        </main>
      </div>

      {/* toast */}
      <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black shadow-glow transition-all ${flash ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}>
        {flash}
      </div>
    </div>
  );
}

function Gate({ onOk }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const attempt = () => (val === getPass() ? onOk() : setErr("Wrong password."));
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 p-5 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-accent text-2xl text-black"><i className="bx bx-lock-alt" /></div>
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="mb-5 mt-1 text-sm text-slate-400">Enter your password to edit the site.</p>
        <input
          type="password"
          autoFocus
          value={val}
          onChange={(e) => { setVal(e.target.value); setErr(""); }}
          onKeyDown={(e) => e.key === "Enter" && attempt()}
          placeholder="Password"
          className="mb-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-center outline-none focus:border-accent"
        />
        <p className="mb-2 h-4 text-xs text-rose-400">{err}</p>
        <button onClick={attempt} className="w-full rounded-lg bg-accent py-2.5 font-semibold text-black">Unlock</button>
        <a href="#/" className="mt-3 block text-sm text-slate-400 hover:text-white">Back to site</a>
      </div>
    </div>
  );
}

function H({ title, desc }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {desc && <p className="mt-1 text-sm text-slate-400">{desc}</p>}
    </div>
  );
}
function Toggle({ c, set, path }) {
  return <Check label="Show this section on the site" value={pathGet(c, path)} onChange={(v) => set(path, v)} />;
}
const pathGet = (o, p) => p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);

function Panel({ tab, c, set, save, reset, ping }) {
  const list = (path, template, itemLabel, renderItem) => (
    <ListEditor items={pathGet(c, path)} template={template} itemLabel={itemLabel} onChange={(v) => set(path, v)} renderItem={renderItem} />
  );

  switch (tab) {
    case "site":
      return (<><H title="Site" desc="Your brand / logo text." />
        <div className="grid grid-cols-2 gap-4">
          <Text label="Brand text" value={c.settings.brandName} onChange={(v) => set("settings.brandName", v)} />
          <Text label="Accent part" value={c.settings.brandAccent} onChange={(v) => set("settings.brandAccent", v)} hint="Shown in the accent color." />
        </div>
        <Check label="Show the 3D spinning globe in the hero" value={c.settings.globe} onChange={(v) => set("settings.globe", v)} />
      </>);

    case "nav":
      return (<><H title="Navigation" desc="Top menu links. Use #section anchors." />
        {list("nav", { label: "New Link", href: "#" }, "Link", (item, on) => (
          <div className="grid grid-cols-2 gap-3">
            <Text label="Label" value={item.label} onChange={(v) => on({ ...item, label: v })} />
            <Text label="Link" value={item.href} onChange={(v) => on({ ...item, href: v })} />
          </div>
        ))}
      </>);

    case "hero":
      return (<><H title="Hero" desc="The first thing visitors see." /><Toggle c={c} set={set} path="hero.enabled" />
        <div className="grid grid-cols-2 gap-4">
          <Text label="Greeting" value={c.hero.greeting} onChange={(v) => set("hero.greeting", v)} />
          <Text label="Intro line" value={c.hero.intro} onChange={(v) => set("hero.intro", v)} />
        </div>
        <Text label="Your name" value={c.hero.name} onChange={(v) => set("hero.name", v)} />
        <Area label="Rotating roles (one per line)" rows={3} value={c.hero.roles.join("\n")} onChange={(v) => set("hero.roles", v.split("\n").map((s) => s.trim()).filter(Boolean))} hint="Shown with a typing effect." />
        <Area label="Short bio" value={c.hero.bio} onChange={(v) => set("hero.bio", v)} />
        <Text label="Profile photo URL" value={c.hero.photo} onChange={(v) => set("hero.photo", v)} hint="Paste any image URL. Blank = placeholder circle." />
        <div className="grid grid-cols-2 gap-4">
          <Text label="Button 1 label" value={c.hero.ctaLabel} onChange={(v) => set("hero.ctaLabel", v)} />
          <Text label="Button 1 link" value={c.hero.ctaHref} onChange={(v) => set("hero.ctaHref", v)} />
          <Text label="Button 2 label" value={c.hero.secondaryLabel} onChange={(v) => set("hero.secondaryLabel", v)} />
          <Text label="Button 2 link" value={c.hero.secondaryHref} onChange={(v) => set("hero.secondaryHref", v)} />
        </div>
        <label className="mb-1.5 mt-2 block text-xs font-semibold text-slate-300">Social links</label>
        {list("hero.socials", { icon: "bx bxl-link", href: "#" }, "Social", (item, on) => (
          <div className="grid grid-cols-2 gap-3">
            <Text label="Icon class" value={item.icon} onChange={(v) => on({ ...item, icon: v })} hint="Boxicons, e.g. bx bxl-github" />
            <Text label="URL" value={item.href} onChange={(v) => on({ ...item, href: v })} />
          </div>
        ))}
      </>);

    case "about":
      return (<><H title="About" desc="Tell your story." /><Toggle c={c} set={set} path="about.enabled" />
        <div className="grid grid-cols-2 gap-4">
          <Text label="Heading" value={c.about.heading} onChange={(v) => set("about.heading", v)} />
          <Text label="Heading accent" value={c.about.headingAccent} onChange={(v) => set("about.headingAccent", v)} />
        </div>
        <Text label="Photo URL" value={c.about.photo} onChange={(v) => set("about.photo", v)} hint="Paste any image URL. Blank = placeholder." />
        <div className="grid grid-cols-2 gap-4">
          <Text label="Title" value={c.about.title} onChange={(v) => set("about.title", v)} />
          <Text label="Subtitle" value={c.about.subtitle} onChange={(v) => set("about.subtitle", v)} />
        </div>
        <Area label="Body" rows={5} value={c.about.body} onChange={(v) => set("about.body", v)} hint="Blank lines = paragraph breaks." />
        <label className="mb-1.5 mt-2 block text-xs font-semibold text-slate-300">Stats</label>
        {list("about.stats", { value: "0+", label: "New stat" }, "Stat", (item, on) => (
          <div className="grid grid-cols-2 gap-3">
            <Text label="Value" value={item.value} onChange={(v) => on({ ...item, value: v })} />
            <Text label="Label" value={item.label} onChange={(v) => on({ ...item, label: v })} />
          </div>
        ))}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Text label="Button label" value={c.about.ctaLabel} onChange={(v) => set("about.ctaLabel", v)} />
          <Text label="Button link" value={c.about.ctaHref} onChange={(v) => set("about.ctaHref", v)} />
        </div>
      </>);

    case "services":
      return (<><H title="Services" desc="What you offer." /><Toggle c={c} set={set} path="services.enabled" />
        <div className="grid grid-cols-2 gap-4">
          <Text label="Heading" value={c.services.heading} onChange={(v) => set("services.heading", v)} />
          <Text label="Heading accent" value={c.services.headingAccent} onChange={(v) => set("services.headingAccent", v)} />
        </div>
        <Text label="Subheading" value={c.services.subheading} onChange={(v) => set("services.subheading", v)} />
        {list("services.items", { icon: "bx bx-star", title: "New Service", desc: "Describe it." }, "Service", (item, on) => (
          <>
            <Text label="Icon class" value={item.icon} onChange={(v) => on({ ...item, icon: v })} hint="e.g. bx bx-code-alt — see boxicons.com" />
            <Text label="Title" value={item.title} onChange={(v) => on({ ...item, title: v })} />
            <Area label="Description" rows={2} value={item.desc} onChange={(v) => on({ ...item, desc: v })} />
          </>
        ))}
      </>);

    case "skills":
      return (<><H title="Skills" desc="Skill bars with a percentage." /><Toggle c={c} set={set} path="skills.enabled" />
        <div className="grid grid-cols-2 gap-4">
          <Text label="Heading" value={c.skills.heading} onChange={(v) => set("skills.heading", v)} />
          <Text label="Heading accent" value={c.skills.headingAccent} onChange={(v) => set("skills.headingAccent", v)} />
        </div>
        <Text label="Subheading" value={c.skills.subheading} onChange={(v) => set("skills.subheading", v)} />
        {list("skills.items", { name: "New Skill", level: 75 }, "Skill", (item, on) => (
          <div className="grid grid-cols-2 gap-3">
            <Text label="Name" value={item.name} onChange={(v) => on({ ...item, name: v })} />
            <Num label="Level (0-100)" value={item.level} onChange={(v) => on({ ...item, level: v })} />
          </div>
        ))}
      </>);

    case "portfolio":
      return (<><H title="Portfolio" desc="Your projects. Paste any image URL." /><Toggle c={c} set={set} path="portfolio.enabled" />
        <div className="grid grid-cols-2 gap-4">
          <Text label="Heading" value={c.portfolio.heading} onChange={(v) => set("portfolio.heading", v)} />
          <Text label="Heading accent" value={c.portfolio.headingAccent} onChange={(v) => set("portfolio.headingAccent", v)} />
        </div>
        <Text label="Subheading" value={c.portfolio.subheading} onChange={(v) => set("portfolio.subheading", v)} />
        {list("portfolio.items", { image: "", title: "New Project", desc: "Short description.", href: "#", tag: "Web" }, "Project", (item, on) => (
          <>
            <Text label="Image URL" value={item.image} onChange={(v) => on({ ...item, image: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Text label="Title" value={item.title} onChange={(v) => on({ ...item, title: v })} />
              <Text label="Tag" value={item.tag} onChange={(v) => on({ ...item, tag: v })} />
            </div>
            <Text label="Description" value={item.desc} onChange={(v) => on({ ...item, desc: v })} />
            <Text label="Project link" value={item.href} onChange={(v) => on({ ...item, href: v })} />
          </>
        ))}
      </>);

    case "contact":
      return (<><H title="Contact" desc="How people reach you." /><Toggle c={c} set={set} path="contact.enabled" />
        <div className="grid grid-cols-2 gap-4">
          <Text label="Heading" value={c.contact.heading} onChange={(v) => set("contact.heading", v)} />
          <Text label="Heading accent" value={c.contact.headingAccent} onChange={(v) => set("contact.headingAccent", v)} />
        </div>
        <Text label="Subheading" value={c.contact.subheading} onChange={(v) => set("contact.subheading", v)} />
        <Text label="Email" value={c.contact.email} onChange={(v) => set("contact.email", v)} />
        <div className="grid grid-cols-2 gap-4">
          <Text label="Phone" value={c.contact.phone} onChange={(v) => set("contact.phone", v)} />
          <Text label="Location" value={c.contact.location} onChange={(v) => set("contact.location", v)} />
        </div>
        <Check label="Show contact form" value={c.contact.formEnabled} onChange={(v) => set("contact.formEnabled", v)} />
        <Text label="Form action URL (optional)" value={c.contact.formAction} onChange={(v) => set("contact.formAction", v)} hint="e.g. a Formspree endpoint. Blank = opens the visitor's email app." />
      </>);

    case "footer":
      return (<><H title="Footer" desc="Bottom of the page." />
        <Text label="Copyright text" value={c.footer.text} onChange={(v) => set("footer.text", v)} />
        <label className="mb-1.5 mt-2 block text-xs font-semibold text-slate-300">Footer social links</label>
        {list("footer.socials", { icon: "bx bxl-link", href: "#" }, "Social", (item, on) => (
          <div className="grid grid-cols-2 gap-3">
            <Text label="Icon class" value={item.icon} onChange={(v) => on({ ...item, icon: v })} />
            <Text label="URL" value={item.href} onChange={(v) => on({ ...item, href: v })} />
          </div>
        ))}
      </>);

    case "theme":
      return (<><H title="Theme" desc="Recolor the whole site live. Changes preview instantly." />
        <div className="grid grid-cols-2 gap-4">
          <Color label="Background" value={c.settings.theme.bg} onChange={(v) => set("settings.theme.bg", v)} />
          <Color label="Secondary background" value={c.settings.theme.bg2} onChange={(v) => set("settings.theme.bg2", v)} />
          <Color label="Text" value={c.settings.theme.text} onChange={(v) => set("settings.theme.text", v)} />
          <Color label="Accent" value={c.settings.theme.accent} onChange={(v) => set("settings.theme.accent", v)} />
          <Color label="Accent 2 (gradient)" value={c.settings.theme.accent2} onChange={(v) => set("settings.theme.accent2", v)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Display font" value={c.settings.theme.fontDisplay} onChange={(v) => set("settings.theme.fontDisplay", v)} options={FONTS} />
          <Select label="Body font" value={c.settings.theme.fontBody} onChange={(v) => set("settings.theme.fontBody", v)} options={FONTS} />
        </div>
        <p className="text-xs text-slate-500">Note: the globe re-reads the accent color on page reload.</p>
      </>);

    case "advanced":
      return <Advanced c={c} save={save} reset={reset} ping={ping} />;

    default:
      return null;
  }
}

function Advanced({ c, save, reset, ping }) {
  const [pw, setPw] = useState("");
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(c, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "content.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    ping("Downloaded content.json");
  };
  const importJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try { save(JSON.parse(r.result)); ping("Imported ✓"); }
      catch { ping("Import failed — invalid JSON."); }
    };
    r.readAsText(file);
  };
  return (<><H title="Advanced" desc="Custom CSS, publishing, password and reset." />
    <Area label="Custom CSS" rows={5} value={c.settings.customCss} onChange={(v) => save({ ...c, settings: { ...c.settings, customCss: v } })} hint="Injected into a managed <style>." />
    <div className="mb-5">
      <label className="mb-1.5 block text-xs font-semibold text-slate-300">Change admin password</label>
      <div className="flex gap-2">
        <input value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-accent" />
        <button onClick={() => { if (pw) { localStorage.setItem(PASS_KEY, pw); setPw(""); ping("Password updated ✓"); } }} className="rounded-lg border border-slate-700 px-4 text-sm hover:bg-slate-800">Update</button>
      </div>
      <p className="mt-1 text-xs text-slate-500">Client-side only — a light lock, not real security.</p>
    </div>
    <div className="mb-5 flex flex-wrap gap-3">
      <button onClick={exportJson} className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-black">⬇ Download content.json</button>
      <label className="cursor-pointer rounded-lg border border-slate-700 px-4 py-2.5 text-sm hover:bg-slate-800">
        ⬆ Import content.json
        <input type="file" accept="application/json" onChange={importJson} className="hidden" />
      </label>
    </div>
    <p className="mb-4 text-xs text-slate-500">To publish on GitHub Pages: download <code>content.json</code>, drop it in the project's <code>public/</code> folder, commit and push.</p>
    <button onClick={() => { if (confirm("Reset ALL content to defaults? This clears your saved edits.")) { reset(); ping("Reset to defaults."); } }} className="rounded-lg border border-rose-500/40 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10">Reset to default content</button>
  </>);
}
