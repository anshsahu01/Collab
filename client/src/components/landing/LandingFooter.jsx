import BrandMark from "./BrandMark";
import { FOOTER_SECTIONS, SOCIAL_LINKS } from "./constants";

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(FOOTER_SECTIONS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-semibold text-foreground mb-4">{section}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <BrandMark nameClass="text-lg" />
          </div>

          <p className="text-sm text-muted-foreground">© {currentYear} Collab. All rights reserved.</p>

          <div className="flex gap-4 mt-4 sm:mt-0">
            {SOCIAL_LINKS.map((social) => (
              <a key={social} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
