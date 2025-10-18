import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Mobile navigation component with burger menu
 */
const MobileNav = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Mobile menu overlay */}
      {open && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/80 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed right-0 top-0 z-50 h-full w-[300px] bg-card border-l shadow-lg md:hidden animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">{t('nav.menu')}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-4 p-6">
              <Link
                to="/"
                className="text-lg font-medium text-primary transition-colors py-2"
                onClick={() => setOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/about"
                className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/legal"
                className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setOpen(false)}
              >
                {t('nav.legal')}
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default MobileNav;
