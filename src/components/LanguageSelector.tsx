import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils"; // Shadcn helper for merging class names

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
  { code: "ca", name: "Català", flag: "/images/flags/ca.svg" },
  { code: "es", name: "Castellano", flag: "/images/flags/es.svg" },
  { code: "en", name: "English", flag: "/images/flags/en.svg" },
];

type LanguageSelectorProps = HTMLAttributes<HTMLDivElement>;

/**
 * Language selector component
 * Dropdown menu for switching between available languages
 */
const LanguageSelector = ({ className, ...props }: LanguageSelectorProps) => {
  
  // Get i18n instance from react-i18next
  const { i18n } = useTranslation();
  
  // Determine the current language
  const currentLanguage = languages.find( (lang) => lang.code === i18n.language ) || languages[0];

  /**
   * Changes the application language
   * @param langCode - ISO language code to switch to
   */
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className={ cn("relative", className) } {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <img src={currentLanguage.flag}
                 alt={`${currentLanguage.name}`}
                 className="w-5 h-5 rounded-sm"
                 loading="lazy" />
            
            <span className="hidden sm:inline">{currentLanguage.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-card">
          {languages.map( (lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="cursor-pointer flex items-center"
            >
              <img src={lang.flag}
                   alt={`${lang.name}`}
                   className="w-5 h-5 mr-2 rounded-sm"
                   loading="lazy"
              />
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;