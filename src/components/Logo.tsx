import { useTranslation } from "react-i18next";

/**
 * Logo component
 * 
 * Displays the AORTIC CODE logo and tagline.
 * Automatically switches between light and dark versions of the logo
 * depending on the active theme (handled by Tailwind's `dark:` modifier).
 */
const Logo = () => {

  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      {/* Wrapper for logo + tagline */}
      <div className="flex flex-col items-start">
        {/*
          Theme-aware logo images:
          - The first <img> shows in LIGHT mode (`block dark:hidden`)
          - The second <img> shows in DARK mode (`hidden dark:block`)
          The `w-40` class defines the image width; adjust as needed.
        */}
        <img
          src="/aorticode-logo-light.png"
          alt="AORTIC CODE logo"
          className="block dark:hidden w-40 h-auto"
        />
        <img
          src="/aorticode-logo-dark.png"
          alt="AORTIC CODE logo (dark mode)"
          className="hidden dark:block w-40 h-auto"
        />

        {/*
          Tagline text:
          - `text-muted-foreground` ensures it adapts to light/dark theme colors.
          - Small, subtle text below the main logo image.
        */}
        <p className="text-sm text-muted-foreground">
          Calculadora de Pròtesis EVAR
        </p>
      </div>
    </div>
  );
};

export default Logo;
