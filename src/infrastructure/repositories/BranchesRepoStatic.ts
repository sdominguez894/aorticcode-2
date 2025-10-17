import { Branch } from "../../domain/entities/Branch";
import { BranchesRepository } from "../../domain/ports/BranchesRepository";

/**
 * Repositorio estático para obtener las ramas de prótesis.
 *
 * Implementa la interfaz `BranchesRepository` del dominio
 * y aplica un patrón singleton para cachear los datos una vez cargados.
 */
export class BranchesRepoStatic implements BranchesRepository
{
    /** Caché compartida entre todas las instancias. */
    private static _cache: Branch[] | null = null;

    /** Ruta del módulo de datos estáticos (sin extensión para compatibilidad con Vite). */
    private static readonly BRANCHES_URL: string = "../../infrastructure/data/branches";

    /**
     * Devuelve todas las ramas de prótesis.
     *
     * Si no están cacheadas, las carga dinámicamente desde el módulo
     * de datos estáticos y crea instancias de `Branch`.
     *
     * @returns Promesa que resuelve con una lista de `Branch`.
     */
    public async getAll(): Promise<Branch[]>
    {
        // Si encara no està carregat → carregar i guardar a la memòria cau
        if (!BranchesRepoStatic._cache)
        {
            const branchesModule = await import(BranchesRepoStatic.BRANCHES_URL);

            // Obtenim les branques del mòdul carregat i generem objectes Branch que guardem a la cache
            BranchesRepoStatic._cache = branchesModule.branches.map(
                (branchData: ConstructorParameters<typeof Branch>[0]) => new Branch(branchData)
            );
        }

        // Retornar el resultat de la memòria cau (ja carregat)
        return BranchesRepoStatic._cache;
    }
}
