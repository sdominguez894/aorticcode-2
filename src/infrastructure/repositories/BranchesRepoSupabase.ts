import { supabase } from "../supabase/supabaseClient";
import { Branch } from "../../domain/entities/Branch";
import type { BranchesRepository } from "../../domain/ports/BranchesRepository";
import type { Database } from "../supabase/types";

/** Type representing a row in the 'branches' table of the database. */
type BranchRecord = Database["public"]["Tables"]["branches"]["Row"];

/**
 * Repository implementation that retrieves Branch entities from Supabase.
 *
 * Implements the `BranchesRepository` domain port using Supabase as the data source.
 * Uses a static cache to avoid redundant network calls once data is loaded.
 */
export class BranchesRepoSupabase implements BranchesRepository
{
    /** Shared in-memory cache across all instances. */
    private static sharedCache: Branch[] | null = null;

    /**
     * Fetches all Branch entities from Supabase.
     * Uses cache when available to minimize network requests.
     *
     * @returns A promise resolving with an array of `Branch` entities.
     * @throws If the Supabase query returns an error.
     */
    public async getAll(): Promise<Branch[]>
    {
        // Return cached data if already loaded
        if ( BranchesRepoSupabase.sharedCache !== null )
        {
            return BranchesRepoSupabase.sharedCache;
        }

        // Execute query against Supabase
        const { data: branchRecords, error: queryError } = await supabase.from("branches")
                                                                         .select("*");

        // Handle query error
        if ( queryError )
        {
            throw new Error(`Error fetching branches from Supabase: ${queryError.message}`);
        }

        // Handle missing or empty data
        if ( !branchRecords )
        {
            return [];
        }

        // Map raw Supabase rows to domain entities
        BranchesRepoSupabase.sharedCache = branchRecords.map(
            (branchRecord: BranchRecord ) => {
                return this.mapBranchRecordToEntity( branchRecord );
            }
        );

        return BranchesRepoSupabase.sharedCache;
    }

    /**
     * Maps a Supabase branch record to a Branch domain entity.
     * 
     * @param branchRecord - The raw branch record from Supabase.
     * 
     * @returns The corresponding Branch domain entity.
     */
    private mapBranchRecordToEntity( branchRecord: BranchRecord ): Branch
    {
        return new Branch(
            {
                code: branchRecord.code,
                diameter: branchRecord.diameter,
                length: branchRecord.length
            }
        );
    }
}
