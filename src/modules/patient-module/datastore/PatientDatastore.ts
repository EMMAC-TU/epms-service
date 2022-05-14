import { Patient } from "../../../shared/entity/Patient";
import { SearchQuery } from "./../../../shared/types/SearchQuery";
import { IPatientDatastore } from "../interfaces/IPatientDatastore";
import { 
    buildCreateQuery, 
    buildDoesFieldExistQuery, 
    buildGetEntityQuery, 
    buildSearchQuery, 
    buildUpdateEntityQuery
} from "../../../shared/functions/BuildQuery";
import { PostgresDriver } from "../../../drivers/PostgresDriver";

/**
 * The Patient Datastore for the Patient Module
 */
export class PatientDatastore implements IPatientDatastore {
    private static instance: IPatientDatastore;
    private client = PostgresDriver.client;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new PatientDatastore();
        }
        return this.instance;
    }

    /**
     * Checks to see if a patient exists
     * @param query The fields to check
     * @returns Returns true if the patient exists, false otherwise
     */
    async doesPatientExist(query: { field: "patientid" | "email"; value: string; }): Promise<boolean> {
        const builtQuery = buildDoesFieldExistQuery('patient', query);
        console.log(builtQuery);
        const numRows = (await this.client.query(builtQuery)).rowCount;
        return numRows !== 0;
    }

    /**
     * Gets a patient by id
     * @param patientId The id of the patient
     * @returns Returns the patient
     */
    async getAPatient(patientId: string): Promise<Patient[]> {
        const query = buildGetEntityQuery('patient', patientId);
        console.log(query);

        const { rows } = await this.client.query(query);
        return rows;
    }

    /**
     * Get All Patients
     * @returns An array of patients
     */
    async getPatients(): Promise<Patient[]> {
        const query = buildGetEntityQuery('patient');
        console.log(query);

        const { rows } = await this.client.query(query);
        return rows;
    }

    /**
     * Updates a patient
     * @param patientId The id of the patient to be updated 
     * @param updatedPatient The fields that will be updated
     */
    async updatePatient(patientId: string, updatedPatient: Partial<Patient>): Promise<void> {
        const query = buildUpdateEntityQuery('patient', patientId, updatedPatient);
        console.log(query);

        await this.client.query(query);
    }

    /**
     * Create a new patient
     * @param newPatient Patient to create
     */
    async createPatient(newPatient: Patient): Promise<void> {
        const query = buildCreateQuery(newPatient);
        console.log(query);

        await this.client.query(query);
    }

    /**
     * Search for patients by a query
     * @param query The search query
     */
    async searchPatients(query: SearchQuery): Promise<{ patients: any[], count: number}> {
        const { searchQuery, countQuery } = buildSearchQuery(query, 'patient');

        const { rows } = await this.client.query(searchQuery);
        const count = await this.countQuery(countQuery);

        return { patients: rows, count };
    }

    /**
     * Gets the number of rows returned for a query
     * @param countQuery The count query
     * @returns The number of rows returned from the query
     */
    private async countQuery(countQuery: { text: string, values: string[] }): Promise<number> {
        const { rows } = await this.client.query(countQuery);
        return Number(rows[0].count);
    }

    
}