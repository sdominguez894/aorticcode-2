/**
 * Represents a prosthesis branch component.
 */
export class Branch
{
    /** Unique code identifying the branch model. */
    public readonly code: string;

    /** Diameter of the prosthesis branch. */
    public readonly diameter: number;

    /** Total length of the branch. */
    public readonly length: number;

    /**
     * @param params.code - Unique identifier or reference code.
     * @param params.diameter - Diameter of the branch.
     * @param params.length - Total length of the branch.
     */
    constructor({ code, diameter, length }: 
        { 
            code: string; 
            diameter: number; 
            length: number; 
        }) 
    {
        /** Unique code identifying the branch model. */
        this.code = code;

        /** Diameter of the prosthesis branch. */
        this.diameter = diameter;

        /** Total length of the branch. */
        this.length = length;
    }

    /**
     * Validates the integrity of the branch’s dimensions.
     * 
     * @throws {Error} If any dimension is invalid.
     */
    public validate(): void
    {
        if( !this.code )
        {
            throw new Error('Branch code is required.');
        }

        if( this.diameter <= 0 )
        {
            throw new Error('Diameter must be positive.');
        }

        if( this.length <= 0 )
        {
            throw new Error('Length must be positive.');
        }
    }
}
