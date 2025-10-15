import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "@/components/Logo";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import MeasurementForm from "@/components/MeasurementForm";
import AnatomicalDiagram from "@/components/AnatomicalDiagram";
import ResultsCard from "@/components/ResultsCard";

/** Measurement data structure */
type MeasurementData = {
  /** Neck diameter in mm */
  neckDiameter: string;
  /** Contralateral iliac diameter in mm */
  contralateralDiameter: string;
  /** Ipsilateral iliac diameter in mm */
  ipsilateralDiameter: string;
  /** Distance to contralateral iliac in mm */
  contralateralDistance: string;
  /** Distance to ipsilateral iliac in mm */
  ipsilateralDistance: string;
};

/**
 * Index page component
 * Main landing page with EVAR prosthesis calculator
 */
const Index = () => {
  const { t } = useTranslation();
  const [calculatedMeasurements, setCalculatedMeasurements] = useState<MeasurementData | null>(null);

  /**
   * Handles calculation from measurement form
   * @param data - Measurement data from form
   */
  const handleCalculate = (data: MeasurementData) => {
    setCalculatedMeasurements(data);
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-radial">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-primary transition-colors">
                {t('nav.home')}
              </Link>
              <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                {t('nav.about')}
              </Link>
              <Link to="/legal" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
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
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Form */}
          <div>
            <MeasurementForm onCalculate={handleCalculate} />
          </div>

          {/* Right Column - Diagram */}
          <div>
            <AnatomicalDiagram measurements={calculatedMeasurements} />
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-4xl mx-auto">
          <ResultsCard measurements={calculatedMeasurements} />
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

export default Index;
