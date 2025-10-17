import { BranchSide } from "../enums/BranchSide";
import { BranchType } from "../enums/BranchType";
import { Branch } from "../entities/Branch";

/**
 * Value Object representing a possible iliac branch prosthetic option, 
 * which may include one or two branches.
 * 
 * The branch option is calculated based on the anatomical measurements of a patient.
 * 
 * Immutable: once created, its properties should not be mutated.
 */
export class BranchOption
{
    private readonly _side: BranchSide;
    private readonly _type: BranchType;
    private readonly _branches: readonly Branch[];
    private readonly _totalCoverage: number;
    private readonly _excess: number;
    private readonly _oversizing: string | number;

    /**
     * @param params Parameters for constructing a BranchOption
     * @param params.side - Side of branch, see `BranchSide`.
     * @param params.type - Type of branch, see `BranchType`.
     * @param params.branches - The branches involved in this option.
     * @param params.totalCoverage - Total coverage length (mm).
     * @param params.excess - Excess coverage beyond anatomical distance (mm).
     * @param params.oversizing - Oversizing percentage.
     */
    constructor(
        {
            side,
            type,
            branches,
            totalCoverage,
            excess,
            oversizing
        }: {
            side: BranchSide;
            type: BranchType;
            branches: Branch[];
            totalCoverage: number;
            excess: number;
            oversizing: string | number;
        })
    {
        this._side = side;
        this._type = type;
        this._branches = Object.freeze(branches.slice()); // immutable copy
        this._totalCoverage = totalCoverage;
        this._excess = excess;
        this._oversizing = oversizing;

        // Freeze the entire object to enforce immutability
        Object.freeze(this);
    }

    /** @returns Side of the branch option (`left` or `right`). */
    get side(): BranchSide
    {
        return this._side;
    }

    /** @returns Type of the branch (e.g., single, double, etc.). */
    get type(): BranchType
    {
        return this._type;
    }

    /** @returns The branches involved in this option. */
    get branches(): readonly Branch[]
    {
        return this._branches;
    }

    /** @returns Total coverage length (mm). */
    get totalCoverage(): number
    {
        return this._totalCoverage;
    }

    /** @returns Excess coverage beyond anatomical distance (mm). */
    get excess(): number
    {
        return this._excess;
    }

    /** @returns Oversizing percentage. */
    get oversizing(): string | number
    {
        return this._oversizing;
    }

    /**
     * Creates a textual summary for display or debugging.
     * 
     * Example: `"LEFT - SINGLE [B001 + B002] — 15% oversizing, +5mm"`
     */
    public toString(): string
    {
        const names = this._branches
            .map(b => b.code ?? b.id ?? "unknown")
            .join(" + ");

        return `${this._side.toUpperCase()} - ${this._type.toUpperCase()} [${names}] — ${this._oversizing}% oversizing, +${this._excess}mm`;
    }
}
