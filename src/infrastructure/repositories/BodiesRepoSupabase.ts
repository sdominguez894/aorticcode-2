import { supabase } from "../supabase/supabaseClient";
import { Body } from "../../domain/entities/Body";
import type { BodiesRepository } from "../../domain/ports/BodiesRepository";
import type { Database } from "../supabase/types";

/** Type representing a row in the 'bodies' table of the database. */
type BodyRecord = Database["public"]["Tables"]["bodies"]["Row"];

/**
 * Repository implementation that retrieves Body entities from Supabase.
 *
 * Implements the `BodiesRepository` domain port using Supabase as the data source.
 * Uses a static cache to avoid redundant network calls once data is loaded.
 */
export class BodiesRepoSupabase implements BodiesRepository
{
    /** Shared in-memory cache across all instances. */
    private static sharedCache: Body[] | null = null;

    /**
     * Fetches all Body entities from Supabase.
     * Uses cache when available to minimize network requests.
     *
     * @returns A promise resolving with an array of `Body` entities.
     * @throws If the Supabase query returns an error.
     */
    public async getAll(): Promise<Body[]>
    {
        // Return cached data if already loaded
        if ( BodiesRepoSupabase.sharedCache !== null && 
             BodiesRepoSupabase.sharedCache.length > 0 )
        {
            return BodiesRepoSupabase.sharedCache;
        }

        // Execute query against Supabase
        const { data: bodyRecords, error: queryError } = await supabase.from("bodies")
                                                                       .select("*");

        // Handle query error
        if ( queryError )
        {
            throw new Error(`Error fetching bodies from Supabase: ${queryError.message}`);
        }

        // Handle missing or empty data
        if ( !bodyRecords )
        {
            return [];
        }

        // Map raw Supabase rows to domain entities
        BodiesRepoSupabase.sharedCache = bodyRecords.map(
            ( bodyRecord: BodyRecord ) => {
                return this.mapBodyRecordToEntity( bodyRecord );
            }
        );
        
        return BodiesRepoSupabase.sharedCache;
    }

    /**
     * Maps a Supabase body record to a Body domain entity.
     * 
     * @param bodyRecord - The raw body record from Supabase.
     * 
     * @returns     The corresponding Body domain entity.
     */
    private mapBodyRecordToEntity( bodyRecord: BodyRecord ): Body
    {
        return new Body(
            {
                code: bodyRecord.code,
                diameter: bodyRecord.diameter,
                length: bodyRecord.length,
                shortLeg: bodyRecord.short_leg,
                longLeg: bodyRecord.long_leg
            }
        );
    }

}
