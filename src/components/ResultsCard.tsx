import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  
  if (!measurements) {
    return (
      <Card className="w-full shadow-glass backdrop-blur-glass animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <CardHeader>
          <CardTitle className="text-2xl">🎯 {t('results.waitingTitle')}</CardTitle>
          <CardDescription>
            {t('results.waitingDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{t('results.waitingCalculation')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Enhanced calculation logic matching the reference image
  const neckDiameter = parseFloat(measurements.neckDiameter);
  const contralateralDiameter = parseFloat(measurements.contralateralDiameter);
  const ipsilateralDiameter = parseFloat(measurements.ipsilateralDiameter);
  const contralateralDistance = parseFloat(measurements.contralateralDistance);
  const ipsilateralDistance = parseFloat(measurements.ipsilateralDistance);

  // Main body calculations
  const mainBodyDiameter = Math.round(neckDiameter * 1.188 * 10) / 10; // 18.8% oversizing
  const oversizingPercent = ((mainBodyDiameter - neckDiameter) / neckDiameter * 100).toFixed(1);
  const bodyLength = 55; // Standard body length
  const contralateralLegLength = 30;
  const ipsilateralLegLength = 65;
  
  // Generate product code for main body
  const mainBodyCode = `CXT${Math.round(neckDiameter)}${Math.round(mainBodyDiameter)}${bodyLength < 100 ? '1' : '2'}E`;

  // Contralateral branch calculations
  const contralateralBodyCoverage = bodyLength + contralateralLegLength - 30; // minus overlap
  const contralateralNeededLength = contralateralDistance - contralateralBodyCoverage;
  
  // Generate 3 options for contralateral branch
  const contralateralOptions = [
    {
      diameter: Math.round(contralateralDiameter * 1.11),
      length: 95,
      oversizing: ((Math.round(contralateralDiameter * 1.11) - contralateralDiameter) / contralateralDiameter * 100).toFixed(1),
    },
    {
      diameter: Math.round(contralateralDiameter * 1.278),
      length: 100,
      oversizing: ((Math.round(contralateralDiameter * 1.278) - contralateralDiameter) / contralateralDiameter * 100).toFixed(1),
    },
    {
      diameter: Math.round(contralateralDiameter * 1.11),
      length: 115,
      oversizing: ((Math.round(contralateralDiameter * 1.11) - contralateralDiameter) / contralateralDiameter * 100).toFixed(1),
    },
  ].map((opt, idx) => ({
    ...opt,
    code: `PLC${opt.diameter}${opt.length < 100 ? '0' : '1'}${Math.floor(opt.length / 100)}00`,
    totalCoverage: contralateralBodyCoverage + opt.length,
    excess: (contralateralBodyCoverage + opt.length) - contralateralDistance,
  }));

  // Ipsilateral branch calculations
  const ipsilateralBodyCoverage = bodyLength + ipsilateralLegLength - 30; // minus overlap
  const ipsilateralNeededLength = ipsilateralDistance - ipsilateralBodyCoverage;
  
  // Generate 3 options for ipsilateral branch
  const ipsilateralOptions = [
    {
      diameter: Math.round(ipsilateralDiameter * 1.125),
      length: 95,
      oversizing: ((Math.round(ipsilateralDiameter * 1.125) - ipsilateralDiameter) / ipsilateralDiameter * 100).toFixed(1),
    },
    {
      diameter: Math.round(ipsilateralDiameter * 1.25),
      length: 95,
      oversizing: ((Math.round(ipsilateralDiameter * 1.25) - ipsilateralDiameter) / ipsilateralDiameter * 100).toFixed(1),
    },
    {
      diameter: Math.round(ipsilateralDiameter * 1.125),
      length: 115,
      oversizing: ((Math.round(ipsilateralDiameter * 1.125) - ipsilateralDiameter) / ipsilateralDiameter * 100).toFixed(1),
    },
  ].map((opt, idx) => ({
    ...opt,
    code: `PLC${opt.diameter}${opt.length < 100 ? '0' : '1'}${Math.floor(opt.length / 100)}00`,
    totalCoverage: ipsilateralBodyCoverage + opt.length,
    excess: (ipsilateralBodyCoverage + opt.length) - ipsilateralDistance,
  }));

  return (
    <Card className="w-full shadow-glass backdrop-blur-glass animate-scale-in border-2 border-medical-success/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <CheckCircle2 className="text-medical-success" />
          {t('results.title')}
        </CardTitle>
        <CardDescription>
          {t('results.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Main Body */}
        <div className="border-l-4 border-primary pl-4">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            {t('results.selectedMainBody')}
          </h3>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20">
            <p className="text-xl font-bold text-destructive mb-2">{mainBodyCode}</p>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">{t('results.diameter')}:</span> {mainBodyDiameter}mm{' '}
                <span className="text-muted-foreground">
                  ({t('results.neck')}: {neckDiameter}mm, {t('results.oversizing')}: +{oversizingPercent}%)
                </span>
              </p>
              <p>
                <span className="font-medium">{t('results.bodyLength')}:</span> {bodyLength}mm
              </p>
              <p>
                <span className="font-medium">{t('results.contralateralLeg')}:</span> {contralateralLegLength}mm |{' '}
                <span className="font-medium">{t('results.ipsilateralLeg')}:</span> {ipsilateralLegLength}mm
              </p>
            </div>
          </div>
        </div>

        {/* Contralateral Branch */}
        <div className="border-l-4 border-secondary pl-4">
          <h3 className="font-semibold text-lg mb-3 text-secondary">
            ← {t('results.contralateralBranch')}
          </h3>
          <div className="space-y-3">
            <div className="text-sm space-y-1">
              <p>
                <span className="font-semibold">{t('results.totalDistanceToCover')}:</span> {contralateralDistance}mm
              </p>
              <p>
                <span className="font-semibold">{t('results.bodyCoverage')}:</span> {contralateralBodyCoverage}mm
              </p>
              <p className="text-xs text-muted-foreground italic">
                {t('results.extensionNeeded')}
              </p>
            </div>
            
            <div className="space-y-2">
              {contralateralOptions.map((option, idx) => (
                <div key={idx} className="bg-gradient-to-r from-secondary/10 to-accent/10 p-3 rounded-lg border border-secondary/20">
                  <p className="font-medium text-sm mb-1">
                    {t('results.option')} {idx + 1}: {t('results.singleBranch')}: <span className="text-secondary">{option.code}</span>{' '}
                    <span className="text-muted-foreground">
                      (Ø{option.diameter}mm, L{option.length}mm, +{option.oversizing}%)
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('results.totalCoverage')}: {option.totalCoverage}mm | {t('results.excess')}: {option.excess}mm
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ipsilateral Branch */}
        <div className="border-l-4 border-accent pl-4">
          <h3 className="font-semibold text-lg mb-3 text-accent">
            ← {t('results.ipsilateralBranch')}
          </h3>
          <div className="space-y-3">
            <div className="text-sm space-y-1">
              <p>
                <span className="font-semibold">{t('results.totalDistanceToCover')}:</span> {ipsilateralDistance}mm
              </p>
              <p>
                <span className="font-semibold">{t('results.bodyCoverage')}:</span> {ipsilateralBodyCoverage}mm
              </p>
              <p className="text-xs text-muted-foreground italic">
                {t('results.extensionNeeded')}
              </p>
            </div>
            
            <div className="space-y-2">
              {ipsilateralOptions.map((option, idx) => (
                <div key={idx} className="bg-gradient-to-r from-accent/10 to-primary/10 p-3 rounded-lg border border-accent/20">
                  <p className="font-medium text-sm mb-1">
                    {t('results.option')} {idx + 1}: {t('results.singleBranch')}: <span className="text-accent">{option.code}</span>{' '}
                    <span className="text-muted-foreground">
                      (Ø{option.diameter}mm, L{option.length}mm, +{option.oversizing}%)
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('results.totalCoverage')}: {option.totalCoverage}mm | {t('results.excess')}: {option.excess}mm
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
