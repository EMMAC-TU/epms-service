import { SearchQuery } from "../../../shared/types/SearchQuery";
import { Patient } from "../../../shared/entity/Patient";

/**
 * The Patient Datastore for the Patient Module
 */
export interface IPatientDatastore {

    /**
     * Checks to see if a patient exists
     * @param query The fields to check
     * @returns Returns true if the patient exists, false otherwise
     */
    doesPatientExist(query: {
        field: "patientid" | "email",
        value: string
    }): Promise<boolean>;
    
    /**
     * Gets a patient by id
     * @param patientId The id of the patient
     * @returns Returns the patient
     */
    getAPatient(patientId: string): Promise<Patient[]>;

    /**
     * Get All Patients
     * @returns An array of patients
     */
    getPatients(): Promise<Patient[]>;

    /**
     * Updates a patient
     * @param patientId The id of the patient to be updated 
     * @param updatedPatient The fields that will be updated
     */
    updatePatient(patientId: string, updatedPatient: Partial<Patient>): Promise<void>; 

    /**
     * Create a new patient
     * @param newPatient Patient to create
     */
    createPatient(newPatient: Patient): Promise<void>;

    /**
     * Search for patients by a query
     * @param query The search query
     */
    searchPatients(query: SearchQuery): Promise<{ patients: any[], count: number}>;
}