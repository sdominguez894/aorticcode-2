import { useState } from "react";
import Logo from "@/components/Logo";
import LanguageSelector from "@/components/LanguageSelector";
import MeasurementForm from "@/components/MeasurementForm";
import AnatomicalDiagram from "@/components/AnatomicalDiagram";
import ResultsCard from "@/components/ResultsCard";

type MeasurementData = {
  neckDiameter: string;
  contralateralDiameter: string;
  ipsilateralDiameter: string;
  contralateralDistance: string;
  ipsilateralDistance: string;
};

const Index = () => {
  const [calculatedMeasurements, setCalculatedMeasurements] = useState<MeasurementData | null>(null);

  const handleCalculate = (data: MeasurementData) => {
    setCalculatedMeasurements(data);
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-radial">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <LanguageSelector />
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
          <p>© {new Date().getFullYear()} Aortic Code. Eina professional per a professionals mèdics.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
