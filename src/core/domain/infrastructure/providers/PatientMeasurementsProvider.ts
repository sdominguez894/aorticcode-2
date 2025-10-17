import { PatientMeasurements } from '/static/domain/value-objects/PatientMeasurements.js';

/**
 * Adapter that reads patient measurements directly from the DOM form.
 * Implements the PatientMeasurementsProvider port.
 */
export class PatientMeasurementsProvider
{
    private readonly neckEl: HTMLInputElement;
    private readonly contralateralIliacEl: HTMLInputElement;
    private readonly ipsilateralIliacEl: HTMLInputElement;
    private readonly contralateralDistanceEl: HTMLInputElement;
    private readonly ipsilateralDistanceEl: HTMLInputElement;

    /**
     * @param selectors.neckSelector - CSS selector for neck input.
     * @param selectors.contralateralIliacSelector - CSS selector for contralateral iliac input.
     * @param selectors.ipsilateralIliacSelector - CSS selector for ipsilateral iliac input.
     * @param selectors.contralateralDistanceSelector - CSS selector for contralateral distance input.
     * @param selectors.ipsilateralDistanceSelector - CSS selector for ipsilateral distance input.
     * 
     * @throws {Error} If any selector does not match an element.
     */
    constructor({
        neckSelector,
        contralateralIliacSelector,
        ipsilateralIliacSelector,
        contralateralDistanceSelector,
        ipsilateralDistanceSelector
    }:
        {
            neckSelector: string;
            contralateralIliacSelector: string;
            ipsilateralIliacSelector: string;
            contralateralDistanceSelector: string;
            ipsilateralDistanceSelector: string;
        })
    {
        this.neckEl = document.querySelector(neckSelector) as HTMLInputElement;
        this.contralateralIliacEl = document.querySelector(contralateralIliacSelector) as HTMLInputElement;
        this.ipsilateralIliacEl = document.querySelector(ipsilateralIliacSelector) as HTMLInputElement;
        this.contralateralDistanceEl = document.querySelector(contralateralDistanceSelector) as HTMLInputElement;
        this.ipsilateralDistanceEl = document.querySelector(ipsilateralDistanceSelector) as HTMLInputElement;

        const missing = [
            !this.neckEl && neckSelector,
            !this.contralateralIliacEl && contralateralIliacSelector,
            !this.ipsilateralIliacEl && ipsilateralIliacSelector,
            !this.contralateralDistanceEl && contralateralDistanceSelector,
            !this.ipsilateralDistanceEl && ipsilateralDistanceSelector
        ].filter(Boolean);

        if( missing.length )
        {
            throw new Error(
                `PatientMeasurementsProvider: Missing DOM elements for selectors: ${missing.join(', ')}`
            );
        }
    }

    /**
     * Reads current form values and returns a valid PatientMeasurements object.
     * @returns {PatientMeasurements}
     */
    public getPatientMeasurements(): PatientMeasurements
    {
        const data = {
            neckDiameter: this._parse(this.neckEl.value),
            contralateralIliacDiameter: this._parse(this.contralateralIliacEl.value),
            ipsilateralIliacDiameter: this._parse(this.ipsilateralIliacEl.value),
            contralateralDistance: this._parse(this.contralateralDistanceEl.value),
            ipsilateralDistance: this._parse(this.ipsilateralDistanceEl.value)
        };

        return new PatientMeasurements(data);
    }

    /** Parses an input string to a number. */
    private _parse(value: string): number
    {
        const n = Number.parseFloat(String(value).trim());
        if( !Number.isFinite(n) )
        {
            throw new Error('Invalid numeric input.');
        }
        return n;
    }
}
