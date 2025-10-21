import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Logo from "@/components/Logo";
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
      <Header />

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
      <Footer />
      
    </div>
  );
};

export default LegalNotice;
