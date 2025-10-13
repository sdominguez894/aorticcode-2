import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { toast } from "sonner";

type MeasurementData = {
  neckDiameter: string;
  contralateralDiameter: string;
  ipsilateralDiameter: string;
  contralateralDistance: string;
  ipsilateralDistance: string;
};

type MeasurementFormProps = {
  onCalculate: (data: MeasurementData) => void;
};

const MeasurementForm = ({ onCalculate }: MeasurementFormProps) => {
  const [measurements, setMeasurements] = useState<MeasurementData>({
    neckDiameter: "24.5",
    contralateralDiameter: "18.0",
    ipsilateralDiameter: "16.5",
    contralateralDistance: "150",
    ipsilateralDistance: "145",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const values = Object.values(measurements);
    if (values.some(v => !v || parseFloat(v) <= 0)) {
      toast.error("Si us plau, introdueix tots els valors correctament");
      return;
    }
    
    onCalculate(measurements);
    toast.success("Càlcul completat");
  };

  const handleInputChange = (field: keyof MeasurementData, value: string) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full shadow-glass backdrop-blur-glass animate-slide-up">
      <CardHeader>
        <CardTitle className="text-2xl">📏 Mesures del Pacient</CardTitle>
        <CardDescription>
          Introdueix les mesures anatòmiques als camps inferiors per obtenir la pròtesi EVAR adequada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="neckDiameter" className="text-base font-medium">
                Diàmetre del coll de l'aneurisma (mm)
              </Label>
              <Input
                id="neckDiameter"
                type="number"
                step="0.1"
                value={measurements.neckDiameter}
                onChange={(e) => handleInputChange("neckDiameter", e.target.value)}
                placeholder="Ej: 24.5"
                className="text-base border-2 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contralateralDiameter" className="text-base font-medium">
                Diàmetre de segellat ilíac contralateral (mm)
              </Label>
              <Input
                id="contralateralDiameter"
                type="number"
                step="0.1"
                value={measurements.contralateralDiameter}
                onChange={(e) => handleInputChange("contralateralDiameter", e.target.value)}
                placeholder="Ej: 18.0"
                className="text-base border-2 focus:border-secondary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ipsilateralDiameter" className="text-base font-medium">
                Diàmetre de segellat ilíac ipsilateral (mm)
              </Label>
              <Input
                id="ipsilateralDiameter"
                type="number"
                step="0.1"
                value={measurements.ipsilateralDiameter}
                onChange={(e) => handleInputChange("ipsilateralDiameter", e.target.value)}
                placeholder="Ej: 16.5"
                className="text-base border-2 focus:border-accent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contralateralDistance" className="text-base font-medium">
                Distància des del coll fins al segellat distal contralateral (mm)
              </Label>
              <Input
                id="contralateralDistance"
                type="number"
                step="0.1"
                value={measurements.contralateralDistance}
                onChange={(e) => handleInputChange("contralateralDistance", e.target.value)}
                placeholder="Ej: 150"
                className="text-base border-2 focus:border-medical-blue transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ipsilateralDistance" className="text-base font-medium">
                Distància des del coll fins al segellat distal ipsilateral (mm)
              </Label>
              <Input
                id="ipsilateralDistance"
                type="number"
                step="0.1"
                value={measurements.ipsilateralDistance}
                onChange={(e) => handleInputChange("ipsilateralDistance", e.target.value)}
                placeholder="Ej: 145"
                className="text-base border-2 focus:border-medical-teal transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-primary hover:opacity-90 transition-all transform hover:scale-[1.02]"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calcular Pròtesi
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MeasurementForm;
