/**
 * Immutable value object representing a patient's anatomical measurements
 * relevant to prosthesis fitting.
 */
export class PatientMeasurements
{
    /** Neck diameter (mm). */
    public readonly neckDiameter: number;

    /** Contralateral iliac diameter (mm). */
    public readonly contralateralIliacDiameter: number;

    /** Ipsilateral iliac diameter (mm). */
    public readonly ipsilateralIliacDiameter: number;

    /** Contralateral distance (mm). */
    public readonly contralateralDistance: number;

    /** Ipsilateral distance (mm). */
    public readonly ipsilateralDistance: number;

    /**
     * @param params.neckDiameter - Neck diameter (mm).
     * @param params.contralateralIliacDiameter - Contralateral iliac diameter (mm).
     * @param params.ipsilateralIliacDiameter - Ipsilateral iliac diameter (mm).
     * @param params.contralateralDistance - Contralateral distance (mm).
     * @param params.ipsilateralDistance - Ipsilateral distance (mm).
     */
    constructor({
        neckDiameter,
        contralateralIliacDiameter,
        ipsilateralIliacDiameter,
        contralateralDistance,
        ipsilateralDistance
    }: 
        {
            neckDiameter: number;
            contralateralIliacDiameter: number;
            ipsilateralIliacDiameter: number;
            contralateralDistance: number;
            ipsilateralDistance: number;
        })
    {
        this.neckDiameter = neckDiameter;
        this.contralateralIliacDiameter = contralateralIliacDiameter;
        this.ipsilateralIliacDiameter = ipsilateralIliacDiameter;
        this.contralateralDistance = contralateralDistance;
        this.ipsilateralDistance = ipsilateralDistance;

        this.validate();
        Object.freeze(this);
    }

    /**
     * Validates that all values are positive numbers.
     * @throws {Error} If any measurement is invalid.
     */
    public validate(): void
    {
        for( const [key, value] of Object.entries(this) )
        {
            if( !Number.isFinite(value) || value <= 0 )
            {
                throw new Error(`Invalid value for ${key}: must be a positive number.`);
            }
        }
    }
}
