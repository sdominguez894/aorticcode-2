import { useEffect, useRef, useCallback } from "react";
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
   * Updates measurement values in the SVG based on input field changes
   * @param event - Input change event
   */
  const updateImageLabel = useCallback((event: Event) => {
    const inputField = event.target as HTMLInputElement;
    if (!inputField || !svgContainerRef.current) return;

    const IMG_VALUE_SUFFIX = "__imgValue";
    let svgElementId = inputField.id + IMG_VALUE_SUFFIX;
    
    // Handle special cases where input ID differs from SVG element ID
    if (inputField.id === "contralateralDiameter") {
      svgElementId = "contralateralIliacDiameter__imgValue";
    } else if (inputField.id === "ipsilateralDiameter") {
      svgElementId = "ipsilateralIliacDiameter__imgValue";
    }

    const imageLabel = svgContainerRef.current.querySelector(`#${svgElementId}`);
    if (imageLabel) {
      imageLabel.textContent = inputField.value;
    }
  }, []);

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
          
          // Initialize with current input values
          const inputIds = [
            'neckDiameter',
            'contralateralDiameter',
            'ipsilateralDiameter',
            'contralateralDistance',
            'ipsilateralDistance'
          ];

          inputIds.forEach(id => {
            const inputElement = document.getElementById(id) as HTMLInputElement;
            if (inputElement) {
              const event = new Event('input', { bubbles: true });
              Object.defineProperty(event, 'target', { value: inputElement, writable: false });
              updateImageLabel(event);
            }
          });
        }
      } catch (error) {
        console.error('Error loading SVG:', error);
      }
    };

    loadSvg();
  }, [updateImageLabel]);

  /**
   * Sets up event listeners for input fields
   */
  useEffect(() => {
    const inputIds = [
      'neckDiameter',
      'contralateralDiameter',
      'ipsilateralDiameter',
      'contralateralDistance',
      'ipsilateralDistance'
    ];

    inputIds.forEach(id => {
      const inputElement = document.getElementById(id);
      if (inputElement) {
        inputElement.addEventListener('input', updateImageLabel);
      }
    });

    // Cleanup event listeners
    return () => {
      inputIds.forEach(id => {
        const inputElement = document.getElementById(id);
        if (inputElement) {
          inputElement.removeEventListener('input', updateImageLabel);
        }
      });
    };
  }, [updateImageLabel]);

  /**
   * Updates measurement values in the SVG when measurements prop changes
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
            // Define CSS variables for SVG colors matching the input field border colors
            ['--light-green' as string]: 'hsl(var(--neckDiameterColor))',
            ['--purple-pink' as string]: 'hsl(var(--contralateralIliacDiameterColor))',
            ['--dark-mint' as string]: 'hsl(var(--ipsilateralIliacDiameterColor))',
            ['--dark-purple' as string]: 'hsl(var(--contralateralDistanceColor))',
            ['--azure' as string]: 'hsl(var(--ipsilateralDistanceColor))'
          }}
        />
      </CardContent>
    </Card>
  );
};

export default AnatomicalDiagram;
