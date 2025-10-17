// Import the repository interface (port) that defines how branches can be fetched.
// The service depends only on this abstraction, not on a concrete implementation.
import type { BranchesRepository } from "../ports/BranchesRepository";

// Import the default repository implementation (adapter) that retrieves data statically.
import { BranchesRepoStatic } from "../../infrastructure/repositories/BranchesRepoStatic";

/**
 * Application service responsible for orchestrating prosthesis branch retrieval.
 * 
 * This service acts as a bridge between the domain and outer layers (e.g., UI or controllers).
 * It depends on the repository *interface* (`BranchesRepository`), not on a specific implementation.
 * 
 * By default, it uses the static repository (`BranchesRepoStatic`), but any other implementation
 * conforming to `BranchesRepository` can be injected — for example, an API-based or database-based repo.
 */
export class BranchesService
{
    /**
     * The repository instance used to retrieve branch entities.
     * It must implement the `BranchesRepository` interface.
     */
    private readonly repo: BranchesRepository;

    /**
     * Creates a new `BranchesService`.
     * 
     * @param repo - A repository implementing `BranchesRepository`. 
     *               If not provided, the static repository (`BranchesRepoStatic`) is used.
     */
    constructor(repo: BranchesRepository = new BranchesRepoStatic())
    {
        this.repo = repo;
    }

    /**
     * Retrieves all prosthesis branches available in the system.
     * 
     * @returns A promise that resolves to an array of `Branch` entities.
     */
    public async getAllBranches()
    {
        // Delegate the data fetching to the repository.
        // The service doesn’t care *how* the repository retrieves the data,
        // only that it fulfills the `BranchesRepository` contract.
        return this.repo.getAll();
    }
}
