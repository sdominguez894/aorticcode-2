import { BodiesRepository } from "../ports/BodiesRepository";
import { BranchesRepository } from "../ports/BranchesRepository";
import { PatientMeasurements } from "../entities/PatientMeasurements";
import { ProsthesisService } from "../services/ProsthesisService";
import { Body } from "../entities/Body";
import { Branch } from "../entities/Branch";
import { BranchOption } from "../valueObjects/BranchOption";

/**
 * Servei d’aplicació responsable de coordinar la lògica de selecció de la pròtesi.
 *
 * Aquesta classe implementa la lògica principal de decisió del selector de pròtesis:
 * - Seleccionar el cos principal (secció aòrtica) segons el diàmetre del coll.
 * - Trobar branques ilíaques compatibles segons distàncies i diàmetres.
 *
 * Delegarà tot l’accés a dades als ports de repositori (bodiesRepo, branchesRepo)
 * i obtindrà les mesures anatòmiques del pacient a través del port PatientMeasurementsProvider.
 */
export class ProsthesisPort
{
    private prosthesisService: ProsthesisService;

    /**
     * Crea una nova instància de ProsthesisService.
     * 
     * ATENCIÓ: Aquesta classe depèn de la injecció de dependències amb el mètode init(), 
     * cal cridar-lo immediatament després de crear la instància i abans d'utilitzar altres mètodes.
     * 
     * @param dependencies - Objecte amb les dependències necessàries.
     * @param dependencies.bodiesRepo - Repositori per accedir als cossos principals.
     * @param dependencies.branchesRepo - Repositori per accedir a les branques ilíaques.
     * @param dependencies.measurements - Proveïdor de mesures anatòmiques del pacient.
     */
    constructor(
        {
            bodiesRepo,
            branchesRepo,
            measurements
        }: {
            bodiesRepo: BodiesRepository;
            branchesRepo: BranchesRepository;
            measurements: PatientMeasurements;
        })
    {
        // Adaptadors / ports proveïts per la capa d’infraestructura
        this.prosthesisService = new ProsthesisService({ bodiesRepo, branchesRepo, measurements });
    }

    /**
     * Inicialitza les dades estàtiques necessàries per a la selecció de pròtesis.
     * Aquesta funció ha de ser cridada abans d'utilitzar altres mètodes del servei.
     *
     * @returns Retorna la mateixa instància per permetre encadenament.
     */
    async init(): Promise<ProsthesisPort>
    {
        // Carrega les dades estàtiques necessàries al servei
        await this.prosthesisService.init();

        // Retorna l'objecte del port
        return this;
    }

    /**
     * Selecciona el cos principal de la pròtesi més adequat per a un pacient donat.
     *
     * El cos principal ha de tenir un sobredimensionament (diferència entre el diàmetre de la pròtesi
     * i el del coll aòrtic) d’entre **10% i 30%**, que és el rang típic en planificació endovascular.
     *
     * @param neckDiameter - Diàmetre del coll aòrtic del pacient (mm).
     * 
     * @returns El cos principal seleccionat (amb la informació de sobredimensionament) 
     *          o null si no hi ha cap opció vàlida.
     */
    selectMainBody(
        neckDiameter: number
    ): { body: Body; oversizing: number } | null
    {
        return this.prosthesisService.selectMainBody(neckDiameter);
    }

    /**
     * Troba les combinacions de branques ilíaques compatibles per les distàncies i diàmetres donats.
     *
     * Aquesta funció determina quines branques poden cobrir la distància requerida
     * mantenint un sobredimensionament dins del rang segur (10%–30%).
     *
     * Avalua tant combinacions d’una sola branca com de dues branques,
     * tenint en compte el solapament mínim entre components (30 mm).
     *
     * @param targetIliacDiameter - Diàmetre objectiu de l’artèria ilíaca (mm).
     * @param bodyLength - Longitud del cos principal seleccionat (mm).
     * @param legLength - Longitud de la cama de la pròtesi (curta o llarga) (mm).
     * @param totalAnatomicalDistance - Distància anatòmica total a cobrir (mm).
     * 
     * @returns Objecte amb opcions de branques compatibles i informació addicional.
     */
    findBranchOptions(
        targetIliacDiameter: number,
        bodyLength: number,
        legLength: number,
        totalAnatomicalDistance: number
    ): {
        options: Array<BranchOption>;
        needsBridge: boolean;
        remainingDistance: number;
        compatibleBranches: Array<Branch>;
    }
    {
        return this.prosthesisService.findBranchOptions(
            targetIliacDiameter,
            bodyLength,
            legLength,
            totalAnatomicalDistance
        );
    }
}
