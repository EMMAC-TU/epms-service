import { PatientCreation } from "../../../shared/types/PatientCreation";
import { Patient } from "../../../shared/entity/Patient";
import { SearchQuery } from "../../../shared/types/SearchQuery";

/**
 * The Patient Component of the Patient Module
 */
export interface IPatientComponent {
    /**
     * Gets all patients in the database
     * @returns 
     */
    getPatients(): Promise<Patient[]>;

    /**
     * Get a patient by their id
     * @param patientid The id of a patient to get
     * @returns A patient record if it exists
     */
    getAPatient(patientid: string): Promise<Patient>;

    /**
     * Update a patient
     * @param patientid Id of patient to update 
     * @param updatePatient Partial Employee that contains all updated fields
     */
    updatePatient(patientid: string, updatePatient: Partial<Patient>): Promise<void>; 

    /**
     * Creates a new patient
     * @param patient The new patient
     */
    createPatient(patient: PatientCreation): Promise<Patient>;

    /**
     * Search for patients based on a query
     * @param query The query to search for patients
     */
    searchPatients(query: SearchQuery): Promise<{ patients: any[], count: number}>;
}