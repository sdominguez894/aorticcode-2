/**
 * Utilities for managing element IDs in the measurements form and SVG diagram.
 */

/** IDs for the measurement input fields. */
export const MEASUREMENTS_FORM_INPUT_IDS = {
  "neckDiameter" : "neckDiameter",
  "contralateralDiameter" : "contralateralDiameter",
  "ipsilateralDiameter" : "ipsilateralDiameter",
  "contralateralDistance" : "contralateralDistance",
  "ipsilateralDistance" : "ipsilateralDistance"
 } as const;


/** Array of all measurements input IDs  (derived once at load time ) */
export const ARRAY_MEASUREMENTS_INPUT_IDS = Object.values( MEASUREMENTS_FORM_INPUT_IDS );
