import { Body } from "../entities/Body";

/**
 * Value Object representing the selected main prosthesis body.
 *
 * Encapsulates the main aortic body chosen according to
 * the patient’s neck diameter and oversizing criteria.
 *
 * Immutable: once created, its properties cannot be changed.
 */
export class MainBody
{
    /** The selected prosthesis body entity. */
    private readonly _body: Body;

    /** Oversizing percentage relative to the patient's aortic neck. */
    private readonly _oversizing: number;

    /**
     * @param params - Parameters for constructing a MainBody object.
     * @param params.body - The selected prosthesis body entity.
     * @param params.oversizing - The oversizing percentage relative to the neck diameter.
     */
    constructor(
        {
            body,
            oversizing
        }: {
            body: Body;
            oversizing: number;
        })
    {
        this._body = body;
        this._oversizing = oversizing;

        // Freeze the entire object to enforce immutability
        Object.freeze(this);
    }

    /** @returns The selected prosthesis body entity. */
    get body(): Body
    {
        return this._body;
    }

    /** @returns Oversizing percentage relative to the neck diameter. */
    get oversizing(): number
    {
        return this._oversizing;
    }

    /**
     * Creates a textual summary for display or debugging.
     *
     * Example: `"Body A001 — 18.5% oversizing (diameter: 26mm, length: 120mm)"`
     */
    public toString(): string
    {
        const code = this._body.code ?? "unknown";
        const diameter = this._body.diameter ?? "?";
        const length = this._body.length ?? "?";

        return `Body ${code} — ${this._oversizing}% oversizing (diameter: ${diameter}mm, length: ${length}mm)`;
    }
}