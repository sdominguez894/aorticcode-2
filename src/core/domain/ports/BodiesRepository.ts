import type { Body } from '/static/domain/entities/Body';

/**
 * Outbound port for fetching prosthesis bodies.
 * Represents the domain-level contract that all repository implementations must follow.
 */
export interface BodiesRepository
{
    /**
     * Retrieves all prosthesis bodies available in the system.
     * @returns Promise resolving to a list of Body entities.
     */
    getAll(): Promise<Body[]>;
}
