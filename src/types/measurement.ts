/**
 * Shared type definition for measurements data in various components
 */

/** Measurement data structure */
export type MeasurementData = {
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
