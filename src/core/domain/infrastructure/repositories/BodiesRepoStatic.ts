import { Body } from '/static/domain/entities/Body.js';

/**
 * Repositorio estático para obtener los cuerpos de prótesis.
 * Implementa un patrón singleton para cachear los datos una vez cargados.
 */
export class BodiesRepoStatic
{
    /** Cache compartida entre todas las instancias. */
    private static _cache: Body[] | null = null;

    /** URL del módulo de datos estáticos. */
    private static readonly BODIES_URL: string = '/static/infrastructure/data/bodies.js';
    
    /**
     * Devuelve todos los cuerpos de prótesis.
     * Si no están cacheados, los carga dinámicamente.
     */
    public async getAll(): Promise<Body[]>
    {
        if( !BodiesRepoStatic._cache )
        {
            // Lazy-load del módulo de datos solo si no está cacheado
            const bodiesModule = await import(BodiesRepoStatic.BODIES_URL);

            // Obtenemos los cuerpos del módulo cargado y generamos objetos Body que guardamos en la caché
            BodiesRepoStatic._cache = bodiesModule.bodies.map(
                (bodyData: ConstructorParameters<typeof Body>[0]) => new Body(bodyData)
            );
        }

        return BodiesRepoStatic._cache;
    }
}
