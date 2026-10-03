import BrandLogo from "./BrandLogo";
import { FOOTER_SECTIONS } from "../data/content";

export default function Footer({ onOpenAuth }) {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-outline-variant">
          {/* Brand Column (2 cols on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="h-9 flex items-center">
              <BrandLogo className="h-8 w-auto" />
            </div>
            <p className="font-reading text-sm text-on-surface-variant max-w-sm leading-relaxed">
              The smart study system that replaces passive note rereading with structured
              topic plans, timed focus sessions, and 80% quiz checkpoints.
            </p>
            <div className="text-xs font-mono text-outline pt-2">
              © 2026 stud bud. Handcrafted for focused students.
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                {section.title}
              </span>
              <ul className="space-y-2 text-sm font-sans text-on-surface-variant">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.action ? (
                      <button
                        type="button"
                        onClick={() => onOpenAuth(link.action)}
                        className="hover:text-primary transition-colors text-left cursor-pointer"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a href={link.href} className="hover:text-primary transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-outline">
          <div className="flex flex-wrap items-center gap-4">
            <span>Open Source</span>
            <span>•</span>
            <span>No Ads</span>
            <span>•</span>
            <span>Secure Data</span>
          </div>
          <div>
            <span>Engineered for Focused Students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
