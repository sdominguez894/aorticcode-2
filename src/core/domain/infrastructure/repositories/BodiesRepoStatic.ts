import { Body } from '../../entities/Body';
import type { IBodiesRepository } from '../../ports/BodiesRepository';

/**
 * Repositorio estático para obtener los cuerpos de prótesis.
 * Implementa un patrón singleton para cachear los datos una vez cargados.
 */
export class BodiesRepoStatic implements BodiesRepository
{
    /** Cache compartida entre todas las instancias. */
    private static _cache: Body[] | null = null;

    /** URL del módulo de datos estáticos. */
    private static readonly BODIES_URL = '/static/infrastructure/data/bodies.ts';

    /**
     * Devuelve todos los cuerpos de prótesis.
     * Si no están cacheados, los carga dinámicamente.
     */
    public async getAll(): Promise<Body[]>
    {
        if( !BodiesRepoStatic._cache )
        {
            const bodiesModule = await import(BodiesRepoStatic.BODIES_URL);

            BodiesRepoStatic._cache = bodiesModule.bodies.map(
                (bodyData: ConstructorParameters<typeof Body>[0]) => new Body(bodyData)
            );
        }

        return BodiesRepoStatic._cache;
    }
}
