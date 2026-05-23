"use client";
import { useEffect, useState } from "react";

const LINKS = [
  { label: "Heroes", href: "#heroes" },
  { label: "Breakfast", href: "#breakfast" },
  { label: "Hot", href: "#hot" },
  { label: "Visit", href: "#visit" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-tile/95 backdrop-blur-xl border-b-2 border-tomato" : "bg-transparent border-b-2 border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 md:px-10">
        <a href="#top" className="font-display text-3xl text-tomato tracking-tight">
          CHUBBIES
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="font-display text-base text-charcoal hover:text-tomato transition-colors">{l.label}</a>
          ))}
        </nav>
        <a href="tel:" className="group inline-flex items-center gap-2 bg-mustard px-5 py-2.5 font-display text-sm text-charcoal hover:bg-tomato hover:text-tile transition-colors">
          Call & order
        </a>
      </div>
    </header>
  );
}
