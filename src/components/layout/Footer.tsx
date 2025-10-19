import { useTranslation } from "react-i18next";

/**
 * Global site footer
 */
const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-card/30 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Aortic Code. {t("home.footer")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;