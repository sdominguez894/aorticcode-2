import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type MeasurementData = {
  neckDiameter: string;
  contralateralDiameter: string;
  ipsilateralDiameter: string;
  contralateralDistance: string;
  ipsilateralDistance: string;
};

type AnatomicalDiagramProps = {
  measurements: MeasurementData | null;
};

const AnatomicalDiagram = ({ measurements }: AnatomicalDiagramProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="w-full shadow-glass backdrop-blur-glass animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <CardHeader>
        <CardTitle className="text-2xl">📐 {t('diagram.title')}</CardTitle>
        <CardDescription>
          {t('diagram.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-8">
        <div className="relative w-full max-w-md aspect-[3/4]">
          <svg
            viewBox="0 0 300 400"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Aneurysm body */}
            <ellipse
              cx="150"
              cy="200"
              rx="80"
              ry="100"
              fill="url(#aneurysmGradient)"
              className="drop-shadow-lg"
            />
            
            {/* Neck */}
            <rect
              x="120"
              y="80"
              width="60"
              height="30"
              fill="hsl(0, 70%, 55%)"
              className="drop-shadow-md"
            />
            
            {/* Iliac branches */}
            <path
              d="M120 280 L80 360"
              stroke="hsl(0, 65%, 50%)"
              strokeWidth="25"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M180 280 L220 360"
              stroke="hsl(0, 65%, 50%)"
              strokeWidth="25"
              strokeLinecap="round"
              fill="none"
            />

            {/* Measurement lines */}
            {measurements && (
              <>
                {/* Neck diameter */}
                <line x1="120" y1="95" x2="80" y2="95" stroke="hsl(210, 85%, 50%)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <line x1="180" y1="95" x2="220" y2="95" stroke="hsl(210, 85%, 50%)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <text x="250" y="100" fill="hsl(210, 85%, 50%)" fontSize="14" fontWeight="600">
                  {measurements.neckDiameter}mm
                </text>

                {/* Contralateral diameter */}
                <line x1="80" y1="340" x2="60" y2="340" stroke="hsl(190, 85%, 45%)" strokeWidth="2" markerEnd="url(#arrowhead2)" />
                <text x="20" y="345" fill="hsl(190, 85%, 45%)" fontSize="14" fontWeight="600">
                  {measurements.contralateralDiameter}mm
                </text>

                {/* Ipsilateral diameter */}
                <line x1="220" y1="340" x2="240" y2="340" stroke="hsl(180, 95%, 50%)" strokeWidth="2" markerEnd="url(#arrowhead3)" />
                <text x="245" y="345" fill="hsl(180, 95%, 50%)" fontSize="14" fontWeight="600">
                  {measurements.ipsilateralDiameter}mm
                </text>

                {/* Distances */}
                <line x1="40" y1="110" x2="40" y2="330" stroke="hsl(200, 85%, 45%)" strokeWidth="2" strokeDasharray="4 4" />
                <text x="10" y="220" fill="hsl(200, 85%, 45%)" fontSize="12" fontWeight="600">
                  {measurements.contralateralDistance}mm
                </text>

                <line x1="260" y1="110" x2="260" y2="330" stroke="hsl(190, 80%, 48%)" strokeWidth="2" strokeDasharray="4 4" />
                <text x="230" y="220" fill="hsl(190, 80%, 48%)" fontSize="12" fontWeight="600">
                  {measurements.ipsilateralDistance}mm
                </text>
              </>
            )}

            <defs>
              <linearGradient id="aneurysmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(0, 75%, 60%)" />
                <stop offset="100%" stopColor="hsl(0, 70%, 50%)" />
              </linearGradient>
              
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <polygon points="0 0, 10 5, 0 10" fill="hsl(210, 85%, 50%)" />
              </marker>
              <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <polygon points="0 0, 10 5, 0 10" fill="hsl(190, 85%, 45%)" />
              </marker>
              <marker id="arrowhead3" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <polygon points="0 0, 10 5, 0 10" fill="hsl(180, 95%, 50%)" />
              </marker>
            </defs>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnatomicalDiagram;
