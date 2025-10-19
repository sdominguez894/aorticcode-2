import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import MobileNav from "@/components/MobileNav";

/**
 * Global site header
 */
const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-primary transition-colors"
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.about")}
            </Link>
            <Link
              to="/legal"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.legal")}
            </Link>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Theme + Language for desktop */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <LanguageSelector />
            </div>
            {/* Mobile menu */}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;