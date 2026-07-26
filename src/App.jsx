import { useEffect, useState } from "react";
import { useSite } from "./store/SiteContext";
import Cursor from "./components/Cursor";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Skills from "./components/Skills";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminApp from "./admin/AdminApp";

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

export default function App() {
  const { content } = useSite();
  const hash = useHashRoute();

  if (hash === "#/admin" || hash === "#admin") return <AdminApp />;

  const s = content;
  return (
    <>
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <main>
        {s.hero.enabled && <Hero />}
        {s.about.enabled && <About />}
        {s.services.enabled && <Services />}
        {s.skills.enabled && <Skills />}
        {s.portfolio.enabled && <Portfolio />}
        {s.contact.enabled && <Contact />}
      </main>
      <Footer />

      {/* subtle admin entry */}
      <a
        href="#/admin"
        title="Edit site (admin)"
        className="fixed bottom-5 left-5 z-40 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-bg2/70 text-lg text-ink/40 backdrop-blur transition-all hover:rotate-90 hover:text-accent"
      >
        <i className="bx bx-cog" />
      </a>
    </>
  );
}
