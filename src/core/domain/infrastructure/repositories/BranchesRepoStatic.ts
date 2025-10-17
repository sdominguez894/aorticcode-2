import { Branch } from '/static/domain/entities/Branch';

/**
 * Repositorio estático para obtener las ramas de prótesis.
 * Implementa un patrón singleton para cachear los datos una vez cargados.
 */
export class BranchesRepoStatic
{
    /** Caché compartida entre todas las instancias. */
    private static _cache: Branch[] | null = null;

    /** URL del módulo de datos estáticos. */
    private static readonly BRANCHES_URL: string = '/static/infrastructure/data/branches.ts';

    /**
     * Devuelve todas las ramas de prótesis.
     * Si no están cacheadas, las carga dinámicamente.
     * @returns {Promise<Branch[]>}
     */
    public async getAll(): Promise<Branch[]>
    {
        // Si encara no està carregat → carregar i guardar a la memòria cau
        if( !BranchesRepoStatic._cache )
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
