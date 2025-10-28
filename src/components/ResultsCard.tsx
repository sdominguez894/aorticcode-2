import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { ProsthesisResults } from "@/hooks/useProsthesisService";
import { BranchType } from "@/domain/enums/BranchType";
import { MeasurementData } from "@/types/measurement";

/** Props for ResultsCard component */
type ResultsCardProps = {
  /** Measurement data for calculations */
  measurements: MeasurementData | null;
  /** Calculated prosthesis results */
  results: ProsthesisResults | null;
  /** Loading state */
  isLoading?: boolean;
};

/**
 * Results card component
 * Displays calculated prosthesis recommendations based on measurements
 */
const ResultsCard = ({ measurements, results, isLoading }: ResultsCardProps) => {
  const { t } = useTranslation();
  
  if (isLoading) {
    return (
      <Card className="w-full shadow-glass backdrop-blur-glass animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <CardHeader>
          <CardTitle className="text-2xl">{t('results.calculating')}</CardTitle>
          <CardDescription>
            {t('results.pleaseWait')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
            <p>{t('results.processingMeasurements')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!measurements || !results) {
    return (
      <Card className="w-full shadow-glass backdrop-blur-glass animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <CardHeader>
          <CardTitle className="text-2xl">{t('results.waitingTitle')}</CardTitle>
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

  const { mainBody, contralateralOptions, ipsilateralOptions } = results;

  if (!mainBody) {
    return (
      <Card className="w-full shadow-glass backdrop-blur-glass animate-slide-up border-2 border-destructive/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
            <AlertCircle className="text-destructive" />
            {t('results.noCompatibleBody')}
          </CardTitle>
          <CardDescription>
            {t('results.noCompatibleBodyDescription')}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const neckDiameter = parseFloat(measurements.neckDiameter);
  const contralateralDistance = parseFloat(measurements.contralateralDistance);
  const ipsilateralDistance = parseFloat(measurements.ipsilateralDistance);

  const contralateralBodyCoverage = mainBody.body.length + mainBody.body.shortLeg - 30;
  const ipsilateralBodyCoverage = mainBody.body.length + mainBody.body.longLeg - 30;

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
            <p className="text-xl font-bold text-destructive mb-2">{mainBody.body.code}</p>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">{t('results.diameter')}:</span> {mainBody.body.diameter}mm{' '}
                <span className="text-muted-foreground">
                  ({t('results.neck')}: {neckDiameter}mm, {t('results.oversizing')}: +{mainBody.oversizing}%)
                </span>
              </p>
              <p>
                <span className="font-medium">{t('results.bodyLength')}:</span> {mainBody.body.length}mm
              </p>
              <p>
                <span className="font-medium">{t('results.contralateralLeg')}:</span> {mainBody.body.shortLeg}mm |{' '}
                <span className="font-medium">{t('results.ipsilateralLeg')}:</span> {mainBody.body.longLeg}mm
              </p>
            </div>
          </div>
        </div>

        {/* Contralateral Branch */}
        <div className="border-l-4 border-secondary pl-4">
          <h3 className="font-semibold text-lg mb-3 text-secondary">
            {t('results.contralateralBranch')}
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
              {contralateralOptions.length === 0 ? (
                <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                  <p className="font-medium text-sm text-destructive">
                    {t('results.noBranchOptions')}
                  </p>
                </div>
              ) : (
                contralateralOptions.slice(0, 3).map((option, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-secondary/10 to-accent/10 p-3 rounded-lg border border-secondary/20">
                    <p className="font-medium text-sm mb-1">
                      {t('results.option')} {idx + 1}: {option.type === BranchType.SINGLE ? t('results.singleBranch') : t('results.doubleBranch')}:{' '}
                      <span className="text-secondary">
                        {option.branches.map(b => b.code).join(' + ')}
                      </span>{' '}
                      <span className="text-muted-foreground">
                        (Ø{option.branches[0].diameter}mm, L{option.branches.map(b => b.length).join('+')}mm, +{option.oversizing}%)
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('results.totalCoverage')}: {option.totalCoverage.toFixed(0)}mm | {t('results.excess')}: {option.excess.toFixed(0)}mm
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Ipsilateral Branch */}
        <div className="border-l-4 border-accent pl-4">
          <h3 className="font-semibold text-lg mb-3 text-accent">
            {t('results.ipsilateralBranch')}
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
              {ipsilateralOptions.length === 0 ? (
                <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                  <p className="font-medium text-sm text-destructive">
                    {t('results.noBranchOptions')}
                  </p>
                </div>
              ) : (
                ipsilateralOptions.slice(0, 3).map((option, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-accent/10 to-primary/10 p-3 rounded-lg border border-accent/20">
                    <p className="font-medium text-sm mb-1">
                      {t('results.option')} {idx + 1}: {option.type === BranchType.SINGLE ? t('results.singleBranch') : t('results.doubleBranch')}:{' '}
                      <span className="text-accent">
                        {option.branches.map(b => b.code).join(' + ')}
                      </span>{' '}
                      <span className="text-muted-foreground">
                        (Ø{option.branches[0].diameter}mm, L{option.branches.map(b => b.length).join('+')}mm, +{option.oversizing}%)
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('results.totalCoverage')}: {option.totalCoverage.toFixed(0)}mm | {t('results.excess')}: {option.excess.toFixed(0)}mm
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
