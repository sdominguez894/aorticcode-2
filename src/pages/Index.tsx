import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MeasurementForm from "@/components/MeasurementForm";
import AnatomicalDiagram from "@/components/AnatomicalDiagram";
import ResultsCard from "@/components/ResultsCard";
import { useProsthesisService, ProsthesisResults } from "@/hooks/useProsthesisService";
import { PatientMeasurements } from "@/domain/entities/PatientMeasurements";
import { toast } from "sonner";

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
  const [prosthesisResults, setProsthesisResults] = useState<ProsthesisResults | null>(null);
  const { calculateProsthesis, isLoading } = useProsthesisService();

  /**
   * Handles calculation from measurement form
   * @param data - Measurement data from form
   */
  const handleCalculate = async (data: MeasurementData) => {
    setCalculatedMeasurements(data);

    try {
      // Create PatientMeasurements entity
      const measurements = new PatientMeasurements({
        neckDiameter: parseFloat(data.neckDiameter),
        contralateralIliacDiameter: parseFloat(data.contralateralDiameter),
        ipsilateralIliacDiameter: parseFloat(data.ipsilateralDiameter),
        contralateralDistance: parseFloat(data.contralateralDistance),
        ipsilateralDistance: parseFloat(data.ipsilateralDistance),
      });

      // Calculate prosthesis using service
      const results = await calculateProsthesis(measurements);
      setProsthesisResults(results);

      if (!results.mainBody) {
        toast.error(t('form.noCompatibleBody'));
      }
    } catch (error) {
      console.error('Error calculating prosthesis:', error);
      toast.error(t('form.calculationError'));
    }
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-radial">
     
      {/* Header */}
      <Header />

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
          <ResultsCard 
            measurements={calculatedMeasurements} 
            results={prosthesisResults}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Index;
