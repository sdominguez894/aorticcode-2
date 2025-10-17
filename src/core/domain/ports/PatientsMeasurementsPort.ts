import { PatientMeasurements } from "../entities/PatientMeasurements";

/**
 * Outbound port for retrieving patient measurement data.
 *
 * The application/service layer depends on this interface,
 * while infrastructure adapters (UI, API, etc.) will implement it.
 *
 * This interface defines the contract for obtaining patient anatomical
 * measurements, ensuring the domain logic remains decoupled from
 * specific data sources (e.g., APIs, databases, UI inputs).
 */
export interface PatientMeasurementsPort
{
    /**
     * Retrieves all anatomical measurements for a given patient.
     *
     * @returns A `PatientMeasurements` object containing
     *          all relevant anatomical data.
     */
    getPatientMeasurements(): PatientMeasurements;
}
