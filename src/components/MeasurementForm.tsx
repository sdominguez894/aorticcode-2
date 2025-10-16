import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
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

/** Props for MeasurementForm component */
type MeasurementFormProps = {
  /** Callback function triggered when form is submitted */
  onCalculate: (data: MeasurementData) => void;
};

/**
 * Measurement form component
 * Collects anatomical measurements for EVAR prosthesis calculation
 */
const MeasurementForm = ({ onCalculate }: MeasurementFormProps) => {
  const { t } = useTranslation();
  const [measurements, setMeasurements] = useState<MeasurementData>({
    neckDiameter: "24.5",
    contralateralDiameter: "18.0",
    ipsilateralDiameter: "16.5",
    contralateralDistance: "150",
    ipsilateralDistance: "145",
  });

  /**
   * Handles form submission and validation
   * @param e - Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const values = Object.values(measurements);
    if (values.some(v => !v || parseFloat(v) <= 0)) {
      toast.error(t('form.validationError'));
      return;
    }
    
    onCalculate(measurements);
    toast.success(t('form.calculationSuccess'));
  };

  /**
   * Updates measurement field value
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const handleInputChange = (field: keyof MeasurementData, value: string) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full shadow-glass backdrop-blur-glass animate-slide-up">
      <CardHeader>
        <CardTitle className="text-2xl">📏 {t('form.title')}</CardTitle>
        <CardDescription>
          {t('form.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="neckDiameter" className="text-base font-medium">
                {t('form.neckDiameter')}
              </Label>
              <Input
                id="neckDiameter"
                type="number"
                step="0.1"
                value={measurements.neckDiameter}
                onChange={(e) => handleInputChange("neckDiameter", e.target.value)}
                placeholder="24.5"
                className="text-base border-2 transition-colors"
                style={{ borderColor: 'hsl(var(--neckDiameterColor))' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contralateralDiameter" className="text-base font-medium">
                {t('form.contralateralDiameter')}
              </Label>
              <Input
                id="contralateralDiameter"
                type="number"
                step="0.1"
                value={measurements.contralateralDiameter}
                onChange={(e) => handleInputChange("contralateralDiameter", e.target.value)}
                placeholder="18.0"
                className="text-base border-2 transition-colors"
                style={{ borderColor: 'hsl(var(--contralateralIliacDiameterColor))' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ipsilateralDiameter" className="text-base font-medium">
                {t('form.ipsilateralDiameter')}
              </Label>
              <Input
                id="ipsilateralDiameter"
                type="number"
                step="0.1"
                value={measurements.ipsilateralDiameter}
                onChange={(e) => handleInputChange("ipsilateralDiameter", e.target.value)}
                placeholder="16.5"
                className="text-base border-2 transition-colors"
                style={{ borderColor: 'hsl(var(--ipsilateralIliacDiameterColor))' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contralateralDistance" className="text-base font-medium">
                {t('form.contralateralDistance')}
              </Label>
              <Input
                id="contralateralDistance"
                type="number"
                step="0.1"
                value={measurements.contralateralDistance}
                onChange={(e) => handleInputChange("contralateralDistance", e.target.value)}
                placeholder="150"
                className="text-base border-2 transition-colors"
                style={{ borderColor: 'hsl(var(--contralateralDistanceColor))' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ipsilateralDistance" className="text-base font-medium">
                {t('form.ipsilateralDistance')}
              </Label>
              <Input
                id="ipsilateralDistance"
                type="number"
                step="0.1"
                value={measurements.ipsilateralDistance}
                onChange={(e) => handleInputChange("ipsilateralDistance", e.target.value)}
                placeholder="145"
                className="text-base border-2 transition-colors"
                style={{ borderColor: 'hsl(var(--ipsilateralDistanceColor))' }}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-primary hover:opacity-90 transition-all transform hover:scale-[1.02]"
          >
            <Calculator className="mr-2 h-5 w-5" />
            {t('form.calculateButton')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MeasurementForm;
