import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";

/**
 * Mobile navigation component with burger menu
 */
const MobileNav = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>{t('nav.menu')}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
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
          <div className="border-t pt-4 mt-4 flex items-center gap-3">
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
