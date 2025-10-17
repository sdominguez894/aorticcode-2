import type { BodiesRepository } from "../ports/BodiesRepository";
import type { BranchesRepository } from "../ports/BranchesRepository";

import { BranchOption } from "../valueObjects/BranchOption";
import { BranchType } from "../enums/BranchType";
import { PatientMeasurements } from "../entities/PatientMeasurements";
import { Body } from "../entities/Body";
import { Branch } from "../entities/Branch";

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
export class ProsthesisService
{
    /** Solapament mínim entre components (en mil·límetres). */
    public static readonly MINIMUM_OVERLAP_MM = 30;

    private readonly bodiesRepo: BodiesRepository;
    private readonly branchesRepo: BranchesRepository;
    private readonly measurements: PatientMeasurements;

    private _bodies: Body[] = [];
    private _branches: Branch[] = [];

    /**
     * Crea una nova instància de `ProsthesisService`.
     * 
     * ATENCIÓ: Aquesta classe depèn de la injecció de dependències amb el mètode `init()`, 
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
        this.bodiesRepo = bodiesRepo;
        this.branchesRepo = branchesRepo;
        this.measurements = measurements;
    }

    /**
     * Inicialitza les dades estàtiques necessàries per a la selecció de pròtesis.
     * Aquesta funció ha de ser cridada abans d'utilitzar altres mètodes del servei.
     *
     * @returns Retorna la mateixa instància però amb les dades inicialitzades.
     */
    public async init(): Promise<ProsthesisService>
    {
        this._bodies = await this.bodiesRepo.getAll();
        this._branches = await this.branchesRepo.getAll();

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
    public selectMainBody(
        neckDiameter: number
    ): (Body & { oversizing: number }) | null
    {
        const allBodies = this._bodies;

        // Rang acceptable de sobredimensionament: 10%–30%
        const minimumAllowedDiameter = neckDiameter * 1.10;
        const maximumAllowedDiameter = neckDiameter * 1.30;

        const compatibleBodies = allBodies.filter(body =>
            body.diameter >= minimumAllowedDiameter &&
            body.diameter <= maximumAllowedDiameter
        );

        if (compatibleBodies.length === 0)
        {
            return null;
        }

        // Selecciona el cos compatible més petit (primer)
        const selectedBody = compatibleBodies[0];

        // Calcula el percentatge de sobredimensionament respecte al coll
        const oversizingPercent = parseFloat(
            ((selectedBody.diameter / neckDiameter - 1) * 100).toFixed(1)
        );

        return { ...selectedBody, oversizing: oversizingPercent };
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
    public findBranchOptions(
        targetIliacDiameter: number,
        bodyLength: number,
        legLength: number,
        totalAnatomicalDistance: number
    ): {
        options: BranchOption[];
        needsBridge: boolean;
        remainingDistance: number;
        compatibleBranches: Branch[];
    }
    {
        const allBranches = this._branches;

        // Rang acceptable de sobredimensionament: 10%–30%
        const minimumAllowedDiameter = targetIliacDiameter * 1.10;
        const maximumAllowedDiameter = targetIliacDiameter * 1.30;

        const compatibleBranches = allBranches.filter(branch =>
            branch.diameter >= minimumAllowedDiameter &&
            branch.diameter <= maximumAllowedDiameter
        );

        const baseCoverage = bodyLength + legLength;

        const remainingDistance =
            totalAnatomicalDistance - baseCoverage + ProsthesisService.MINIMUM_OVERLAP_MM;

        const branchOptions: BranchOption[] = [];

        // -------------------------------------------------------------------------
        // Combinacions d’una sola branca
        // -------------------------------------------------------------------------
        for (const singleBranch of compatibleBranches)
        {
            const totalCoverage =
                baseCoverage + singleBranch.length - ProsthesisService.MINIMUM_OVERLAP_MM;

            if (totalCoverage >= totalAnatomicalDistance)
            {
                const oversizingPercent = parseFloat(
                    ((singleBranch.diameter / targetIliacDiameter - 1) * 100).toFixed(1)
                );

                branchOptions.push(
                    new BranchOption({
                        side: singleBranch.side,
                        type: BranchType.SINGLE,
                        branches: [singleBranch],
                        totalCoverage,
                        excess: totalCoverage - totalAnatomicalDistance,
                        oversizing: oversizingPercent
                    })
                );
            }
        }

        // -------------------------------------------------------------------------
        // Combinacions de doble branca
        // -------------------------------------------------------------------------
        for (const firstBranch of compatibleBranches)
        {
            for (const secondBranch of compatibleBranches)
            {
                if (firstBranch.diameter !== secondBranch.diameter)
                {
                    continue;
                }

                const totalCoverage =
                    baseCoverage +
                    firstBranch.length +
                    secondBranch.length -
                    2 * ProsthesisService.MINIMUM_OVERLAP_MM;

                const combinedLength =
                    firstBranch.length + secondBranch.length - ProsthesisService.MINIMUM_OVERLAP_MM;

                const isLongEnough = combinedLength > remainingDistance;

                if (totalCoverage >= totalAnatomicalDistance && isLongEnough)
                {
                    const oversizingPercent = parseFloat(
                        ((firstBranch.diameter / targetIliacDiameter - 1) * 100).toFixed(1)
                    );

                    branchOptions.push(
                        new BranchOption({
                            side: firstBranch.side,
                            type: BranchType.DOUBLE,
                            branches: [firstBranch, secondBranch],
                            totalCoverage,
                            excess: totalCoverage - totalAnatomicalDistance,
                            oversizing: oversizingPercent
                        })
                    );
                }
            }
        }

        // -------------------------------------------------------------------------
        // Determina si cal una extensió ("pont") addicional
        // -------------------------------------------------------------------------
        const longestAvailableBranchLength = Math.max(
            ...compatibleBranches.map(b => b.length),
            0
        );

        const requiresBridgeExtension =
            branchOptions.length === 0 || remainingDistance > longestAvailableBranchLength;

        // Ordena les opcions pel menor excés (ajust més precís primer)
        branchOptions.sort((a, b) => a.excess - b.excess);

        return {
            options: branchOptions,
            needsBridge: requiresBridgeExtension,
            remainingDistance,
            compatibleBranches
        };
    }
}
