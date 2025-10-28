import { useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MeasurementData } from "@/types/measurement";
import svgUrl from "@/assets/anatomic-measurements.svg";
import { MEASUREMENTS_FORM_INPUT_IDS as inputIds } from "./MeasurementsIds";
import { ARRAY_MEASUREMENTS_INPUT_IDS as inputIdsArray } from "./MeasurementsIds";
import { getSvgId, updateSvgText } from "@/utils/svgUtils";



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
    
    // Ensure input field and SVG container are available
    if ( !inputField || !svgContainerRef.current )
    {  
      return;
    }

    // Get the SVG element from the container
    const svg = svgContainerRef.current.querySelector('svg') as SVGSVGElement | null;

    // Update the text element in the SVG corresponding to the changed input field
    updateSvgText( svg, inputField.id, inputField.value );

  }, []);

  /**
   * Loads and injects SVG content into the DOM
   */
  useEffect(() => {

    // Fetch and load the SVG content
    const loadSvg = async () => {
      
      try 
      {
        // Fetch SVG file as text and store in ref to avoid re-fetching
        const response = await fetch(svgUrl);
        const rawSvg = await response.text();
        svgContentRef.current = rawSvg;
        
        if ( svgContainerRef.current ) 
        {
          // Inject SVG into container
          svgContainerRef.current.innerHTML = rawSvg;

          // Trigger update for each input to set initial SVG labels values
          inputIdsArray.forEach( id => {
            
            // Simulate input event to update SVG labels
            const inputElement = document.getElementById(id) as HTMLInputElement;
            
            // Trigger update if input element exists
            if ( inputElement )
            {
              const event = new Event('input', { bubbles: true });
              Object.defineProperty(event, 'target', { value: inputElement, writable: false });
              updateImageLabel(event);
            }
          });
        }
      } 
      catch( error )
      {
        console.error('Error loading SVG:', error);
      }
    };

    loadSvg();
  }, [ updateImageLabel ]);

  /**
   * Sets up event listeners for input fields
   */
  useEffect(() => {

    // Attach input event listeners to form fields
    inputIdsArray.forEach(id => {

      const inputElement = document.getElementById(id);
      
      if( inputElement ) 
      {
        inputElement.addEventListener('input', updateImageLabel);
      }
    });

    // Cleanup event listeners
    return () => {
      inputIdsArray.forEach(id => {
        const inputElement = document.getElementById(id);
        
        if( inputElement )
        {
          inputElement.removeEventListener('input', updateImageLabel);
        }
      });
    };
  }, [ updateImageLabel ]);

  /**
   * Updates measurement values in the SVG when measurements prop changes
   */
  useEffect(() => {
    
    // Ensure SVG container and measurements data are available
    if( !svgContainerRef.current || !measurements )
    { 
      return;
    }

    // Update text elements with measurement values
    const svg = svgContainerRef.current.querySelector('svg') as SVGSVGElement | null;

    // Check if SVG is loaded correctly
    if( !svg )
    {
      return;
    }

    // Update each measurement in the SVG
    updateSvgText( svg, inputIds.neckDiameter, measurements.neckDiameter );
    updateSvgText( svg, inputIds.contralateralDiameter, measurements.contralateralDiameter );
    updateSvgText( svg, inputIds.ipsilateralDiameter, measurements.ipsilateralDiameter );
    updateSvgText( svg, inputIds.contralateralDistance, measurements.contralateralDistance );
    updateSvgText( svg, inputIds.ipsilateralDistance, measurements.ipsilateralDistance );

  }, [ measurements ]);

  return (
    <Card className="w-full shadow-glass backdrop-blur-glass animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <CardHeader>
        <CardTitle className="text-2xl">📐 {t('diagram.title')}</CardTitle>
        <CardDescription>
          {t('diagram.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-8 pt-0">
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
