import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "@/components/Logo";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import { AlertTriangle, Shield, FileText, Scale } from "lucide-react";

/**
 * Legal Notice page component
 * Displays disclaimers, liability limitations, and legal information
 */
const LegalNotice = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background bg-gradient-radial">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                {t('nav.home')}
              </Link>
              <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                {t('nav.about')}
              </Link>
              <Link to="/legal" className="text-sm font-medium text-primary transition-colors">
                {t('nav.legal')}
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('legal.title')}</h1>
            <p className="text-lg text-muted-foreground">
              {t('legal.subtitle')}
            </p>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-glass mb-6 animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-destructive/10 flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">{t('legal.medicalDisclaimer.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('legal.medicalDisclaimer.content')}
                </p>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-glass mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/10 flex-shrink-0">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">{t('legal.liability.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('legal.liability.content')}
                </p>
              </div>
            </div>
          </div>

          {/* Professional Use Only */}
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-glass mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-medical-blue/10 flex-shrink-0">
                <FileText className="h-6 w-6 text-medical-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">{t('legal.professionalUse.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('legal.professionalUse.content')}
                </p>
              </div>
            </div>
          </div>

          {/* Accuracy and Updates */}
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-glass animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-medical-teal/10 flex-shrink-0">
                <Scale className="h-6 w-6 text-medical-teal" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">{t('legal.accuracy.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('legal.accuracy.content')}
                </p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center mt-12 text-sm text-muted-foreground">
            <p>{t('legal.lastUpdated')}: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Aortic Code. {t('home.footer')}</p>
        </div>
      </footer>
    </div>
  );
};

export default LegalNotice;
