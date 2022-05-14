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
     * 
     * @param query 
     * @returns 
     */
    async doesPatientExist(query: { field: "patientid" | "email"; value: string; }): Promise<boolean> {
        const builtQuery = buildDoesFieldExistQuery('patient', query);
        console.log(builtQuery);
        const numRows = (await this.client.query(builtQuery)).rowCount;
        return numRows !== 0;
    }

    /**
     * 
     * @param patientId 
     * @returns 
     */
    async getAPatient(patientId: string): Promise<Patient[]> {
        const query = buildGetEntityQuery('patient', patientId);
        console.log(query);

        const { rows } = await this.client.query(query);
        return rows;
    }

    /**
     * 
     * @returns 
     */
    async getPatients(): Promise<Patient[]> {
        const query = buildGetEntityQuery('patient');
        console.log(query);

        const { rows } = await this.client.query(query);
        return rows;
    }

    /**
     * 
     * @param patientId 
     * @param updatedPatient 
     */
    async updatePatient(patientId: string, updatedPatient: Partial<Patient>): Promise<void> {
        const query = buildUpdateEntityQuery('patient', patientId, updatedPatient);
        console.log(query);

        await this.client.query(query);
    }

    /**
     * 
     * @param newPatient 
     */
    async createPatient(newPatient: Patient): Promise<void> {
        const query = buildCreateQuery(newPatient);
        console.log(query);

        await this.client.query(query);
    }

    /**
     * 
     * @param query 
     */
    async searchPatients(query: SearchQuery): Promise<{ patients: any[], count: number}> {
        const { searchQuery, countQuery } = buildSearchQuery(query, 'patient');

        const { rows } = await this.client.query(searchQuery);
        const count = await this.countQuery(countQuery);

        return { patients: rows, count };
    }

    private async countQuery(countQuery: { text: string, values: string[] }): Promise<number> {
        const { rows } = await this.client.query(countQuery);
        return Number(rows[0].count);
    }

    
}