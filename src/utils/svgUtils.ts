/** Suffix appended to a form input ID to get the corresponding SVG element ID. */
export const SVG_ID_SUFFIX = "__svgId";

/**
 * Converts a form input ID to its corresponding SVG text element ID.
 * 
 * @param inputId - The ID of one of the measurement form inputs
 * 
 * @returns The corresponding SVG element ID.
 */
export function getSvgId( inputId: string ): string {
  return `${inputId}${SVG_ID_SUFFIX}`;
}

/**
 * Updates the text content of a specific `<text>` element within an SVG.
 *
 * Finds an SVG text element by transforming an input ID into the corresponding SVG element ID (via `getSvgId`) 
 * and updates its text content with the provided value — if the element exists.
 *
 * @param {SVGSVGElement} svg - The root SVG element that contains the target text element
 * @param {string} inputId    - The identifier associated with the text element (used to derive the SVG element ID)
 * @param {string} value      - The text content to set on the SVG text element
 */
export const updateSvgText = ( svg: SVGSVGElement, inputId: string, value: string ): void => {
  
  // Derive the SVG element ID using a helper (e.g., converts input ID -> SVG text element ID)
  const elementId = getSvgId(inputId);

  // Attempt to find the corresponding <text> element inside the SVG
  const element = svg.getElementById(elementId) as SVGTextElement | null;

  // If the element exists, update its displayed text
  if( element )
  {
    element.textContent = value;
  }
};