import { useState } from "react";
import BrandLogo from "./BrandLogo";
import { NAVIGATION_LINKS } from "../data/content";

export default function Header({ onOpenAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f6]/92 backdrop-blur-md border-b border-outline-variant">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-6">
        {/* Brand Logo Left */}
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-hidden"
          aria-label="stud bud Home"
        >
          <div className="h-10 flex items-center">
            <BrandLogo />
          </div>
          <div className="hidden xl:flex flex-col border-l border-outline-variant pl-3">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-secondary">
              Study System
            </span>
            <span className="text-[11px] text-on-surface-variant font-medium">
              Smart Exam Prep
            </span>
          </div>
        </a>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAVIGATION_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase font-semibold tracking-wider text-on-surface-variant hover:text-secondary transition-colors py-1.5 border-b-2 border-transparent hover:border-secondary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Desktop Auth CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenAuth("login")}
            className="inline-flex items-center gap-2 bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded hover:bg-black transition-all shadow-xs active:translate-y-px cursor-pointer"
          >
            <span>Log In</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded text-primary hover:bg-surface-container transition-colors focus:outline-hidden cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-outline-variant bg-[#faf8f6] px-6 py-5 shadow-lg space-y-4 animate-in fade-in duration-150">
          <nav className="flex flex-col space-y-3">
            {NAVIGATION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase font-semibold tracking-wider text-on-surface hover:text-secondary py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-outline-variant/60 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth("login");
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider py-2.5 rounded hover:bg-black transition-colors cursor-pointer"
            >
              <span>Log In</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
