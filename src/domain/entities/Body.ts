/**
 * Represents a prosthesis body component.
 */
export class Body
{
    /** Unique code identifying the body model. */
    public readonly code: string;

    /** Diameter of the prosthesis body. */
    public readonly diameter: number;

    /** Total length of the body. */
    public readonly length: number;

    /** Length of the short leg section. */
    public readonly shortLeg: number;

    /** Length of the long leg section. */
    public readonly longLeg: number;

    /**
     * @param params.code - Unique identifier or reference code.
     * @param params.diameter - Diameter of the body.
     * @param params.length - Total length of the body.
     * @param params.shortLeg - Length of the short leg.
     * @param params.longLeg - Length of the long leg.
     */
    constructor({ code, diameter, length, shortLeg, longLeg }: 
        { 
            code: string; 
            diameter: number; 
            length: number; 
            shortLeg: number; 
            longLeg: number; 
        }) 
    {
        /** Unique code identifying the body model. */
        this.code = code;

        /** Diameter of the prosthesis body. */
        this.diameter = diameter;

        /** Total length of the body. */
        this.length = length;

        /** Length of the short leg section. */
        this.shortLeg = shortLeg;

        /** Length of the long leg section. */
        this.longLeg = longLeg;
    }

    /**
     * Validates the integrity of the body’s dimensions.
     * 
     * @throws {Error} If any dimension is invalid.
     */
    public validate(): void
    {
        if( !this.code )
        {
            throw new Error('Body code is required.');
        }

        if( this.diameter <= 0 )
        {
            throw new Error('Diameter must be positive.');
        }

        if( this.length <= 0 )
        {
            throw new Error('Length must be positive.');
        }

        if( this.shortLeg < 0 || this.longLeg < 0 )
        {
            throw new Error('Leg lengths must be non-negative.');
        }
    }
}
