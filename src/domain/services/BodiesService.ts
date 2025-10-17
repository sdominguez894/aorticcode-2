// Import the repository interface (port) that defines how bodies can be fetched.
// The service depends only on this abstraction, not on a concrete implementation.
import type { BodiesRepository } from '../ports/BodiesRepository';

// Import the default repository implementation (adapter) that retrieves data statically.
import { BodiesRepoStatic } from '../../infrastructure/repositories/BodiesRepoStatic';

/**
 * Application service responsible for orchestrating prosthesis body retrieval.
 * 
 * This service acts as a bridge between the domain and outer layers (e.g., UI or controllers).
 * It depends on the repository *interface* (BodiesRepository), not on a specific implementation.
 * 
 * By default, it uses the static repository (BodiesRepoStatic), but any other implementation
 * conforming to BodiesRepository can be injected — for example, an API-based or database-based repo.
 */
export class BodiesService
{
    /**
     * The repository instance used to retrieve body entities.
     * It must implement the BodiesRepository interface.
     */
    private readonly repo: BodiesRepository;

    /**
     * Creates a new BodiesService.
     * 
     * @param repo - A repository implementing BodiesRepository. 
     *               If not provided, the static repository (BodiesRepoStatic) is used.
     */
    constructor(repo: BodiesRepository = new BodiesRepoStatic())
    {
        this.repo = repo;
    }

    /**
     * Retrieves all prosthesis bodies available in the system.
     * 
     * @returns A promise that resolves to an array of Body entities.
     */
    public async getAllBodies()
    {
        // Delegate the data fetching to the repository.
        // The service doesn’t care *how* the repository retrieves the data,
        // only that it fulfills the BodiesRepository contract.
        return this.repo.getAll();
    }
}
