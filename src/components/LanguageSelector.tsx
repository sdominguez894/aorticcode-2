import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

/** Language option structure */
type Language = {
  /** ISO language code */
  code: string;
  /** Display name of the language */
  name: string;
  /** Emoji flag representation */
  flag: string;
};

/** Available language options */
const languages: Language[] = [
  { code: "ca", name: "Català", flag: "🇪🇸" },
  { code: "es", name: "Castellano", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

/**
 * Language selector component
 * Dropdown menu for switching between available languages
 */
const LanguageSelector = () => {
  const { i18n } = useTranslation();
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  /**
   * Changes the application language
   * @param langCode - ISO language code to switch to
   */
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span>{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="cursor-pointer"
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
