import { Branch } from "../entities/Branch.ts";

/**
 * Outbound port for fetching prosthesis branches.
 *
 * The application/service layer depends on this interface,
 * while infrastructure adapters (e.g. static files, APIs, databases)
 * will implement it.
 */
export interface BranchesRepository
{
    /**
     * Retrieves all available prosthesis branches.
     *
     * @returns A promise resolving to an array of `Branch` entities.
     */
    getAll(): Promise<Branch[]>;
}
