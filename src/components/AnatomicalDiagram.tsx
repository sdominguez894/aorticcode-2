import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import svgUrl from "@/assets/anatomic-measurements.svg";

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

/** Props for AnatomicalDiagram component */
type AnatomicalDiagramProps = {
  /** Measurement data to display on diagram */
  measurements: MeasurementData | null;
};

/**
 * Anatomical diagram component
 * Renders an SVG visualization of aortic aneurysm with measurement overlays
 */
const AnatomicalDiagram = ({ measurements }: AnatomicalDiagramProps) => {
  const { t } = useTranslation();
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const svgContentRef = useRef<string>("");

  /**
   * Loads and injects SVG content into the DOM
   */
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(svgUrl);
        const svgText = await response.text();
        svgContentRef.current = svgText;
        
        if (svgContainerRef.current) {
          svgContainerRef.current.innerHTML = svgText;
        }
      } catch (error) {
        console.error('Error loading SVG:', error);
      }
    };

    loadSvg();
  }, []);

  /**
   * Updates measurement values in the SVG
   */
  useEffect(() => {
    if (!svgContainerRef.current || !measurements) return;

    // Update text elements with measurement values
    const neckDiameterEl = svgContainerRef.current.querySelector('#neckDiameter__imgValue');
    const contralateralDiameterEl = svgContainerRef.current.querySelector('#contralateralIliacDiameter__imgValue');
    const ipsilateralDiameterEl = svgContainerRef.current.querySelector('#ipsilateralIliacDiameter__imgValue');
    const contralateralDistanceEl = svgContainerRef.current.querySelector('#contralateralDistance__imgValue');
    const ipsilateralDistanceEl = svgContainerRef.current.querySelector('#ipsilateralDistance__imgValue');

    if (neckDiameterEl) neckDiameterEl.textContent = measurements.neckDiameter;
    if (contralateralDiameterEl) contralateralDiameterEl.textContent = measurements.contralateralDiameter;
    if (ipsilateralDiameterEl) ipsilateralDiameterEl.textContent = measurements.ipsilateralDiameter;
    if (contralateralDistanceEl) contralateralDistanceEl.textContent = measurements.contralateralDistance;
    if (ipsilateralDistanceEl) ipsilateralDistanceEl.textContent = measurements.ipsilateralDistance;
  }, [measurements]);
  
  return (
    <Card className="w-full shadow-glass backdrop-blur-glass animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <CardHeader>
        <CardTitle className="text-2xl">📐 {t('diagram.title')}</CardTitle>
        <CardDescription>
          {t('diagram.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-8">
        <div 
          ref={svgContainerRef}
          className="relative w-full max-w-2xl"
          style={{
            // Define CSS variables for SVG colors
            ['--light-green' as string]: 'hsl(var(--primary))',
            ['--purple-pink' as string]: 'hsl(var(--secondary))',
            ['--dark-mint' as string]: 'hsl(var(--accent))',
            ['--dark-purple' as string]: 'hsl(var(--secondary))',
            ['--azure' as string]: 'hsl(var(--primary))'
          }}
        />
      </CardContent>
    </Card>
  );
};

export default AnatomicalDiagram;
