// Catálogo de prótesis con correcciones de longitud de patas
import type { Body } from '../../domain/entities/Body';

/**
 * Catálogo de cuerpos de prótesis predefinidos.
 * Cada elemento coincide con los parámetros esperados por la clase Body.
 */
export const bodies: Array<ConstructorParameters<typeof Body>[0]> = 
[
    { code: 'CXT201412E', diameter: 20,   length: 55, shortLeg: 30, longLeg: 65 },
    { code: 'CXT231412E', diameter: 23,   length: 55, shortLeg: 30, longLeg: 65 },
    { code: 'CXT261412E', diameter: 26,   length: 55, shortLeg: 30, longLeg: 65 },
    { code: 'CXT281412E', diameter: 28.5, length: 55, shortLeg: 30, longLeg: 65 },
    { code: 'CXT321414E', diameter: 32,   length: 65, shortLeg: 30, longLeg: 75 },
    { code: 'CXT361414E', diameter: 36,   length: 65, shortLeg: 30, longLeg: 75 }
];
