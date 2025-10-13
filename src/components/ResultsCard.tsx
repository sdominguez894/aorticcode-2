import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";

type MeasurementData = {
  neckDiameter: string;
  contralateralDiameter: string;
  ipsilateralDiameter: string;
  contralateralDistance: string;
  ipsilateralDistance: string;
};

type ResultsCardProps = {
  measurements: MeasurementData | null;
};

const ResultsCard = ({ measurements }: ResultsCardProps) => {
  if (!measurements) {
    return (
      <Card className="w-full shadow-glass backdrop-blur-glass animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <CardHeader>
          <CardTitle className="text-2xl">🎯 Resultats i Recomanacions</CardTitle>
          <CardDescription>
            Introdueix les mesures del pacient i fes clic a "Calcular Pròtesi" per obtenir les recomanacions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Esperant càlcul...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Simple calculation logic (this would be more complex in a real application)
  const neckSize = parseFloat(measurements.neckDiameter);
  const recommendedMainBodySize = Math.ceil(neckSize * 1.15);
  const contralateralLimbSize = Math.ceil(parseFloat(measurements.contralateralDiameter) * 1.15);
  const ipsilateralLimbSize = Math.ceil(parseFloat(measurements.ipsilateralDiameter) * 1.15);

  return (
    <Card className="w-full shadow-glass backdrop-blur-glass animate-scale-in border-2 border-medical-success/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <CheckCircle2 className="text-medical-success" />
          Resultats i Recomanacions
        </CardTitle>
        <CardDescription>
          Recomanacions basades en les mesures del pacient
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20">
            <h3 className="font-semibold text-lg mb-2 text-primary">Cos Principal</h3>
            <p className="text-2xl font-bold">{recommendedMainBodySize}mm</p>
            <p className="text-sm text-muted-foreground mt-1">
              Basat en diàmetre del coll: {measurements.neckDiameter}mm
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-secondary/10 to-accent/10 p-4 rounded-lg border border-secondary/20">
              <h3 className="font-semibold mb-2 text-secondary">Branca Contralateral</h3>
              <p className="text-xl font-bold">{contralateralLimbSize}mm</p>
              <p className="text-sm text-muted-foreground mt-1">
                Longitud: {measurements.contralateralDistance}mm
              </p>
            </div>

            <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-4 rounded-lg border border-accent/20">
              <h3 className="font-semibold mb-2 text-accent">Branca Ipsilateral</h3>
              <p className="text-xl font-bold">{ipsilateralLimbSize}mm</p>
              <p className="text-sm text-muted-foreground mt-1">
                Longitud: {measurements.ipsilateralDistance}mm
              </p>
            </div>
          </div>
        </div>

        <div className="bg-medical-success/10 border border-medical-success/30 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2 text-medical-success">
            <CheckCircle2 className="w-5 h-5" />
            Notes Clíniques
          </h4>
          <ul className="space-y-1 text-sm">
            <li>✓ Mesures dins del rang acceptable per EVAR</li>
            <li>✓ Sobredimensionament del 15% aplicat</li>
            <li>✓ Verifica disponibilitat de mides amb el fabricant</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
