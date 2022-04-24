import { SearchQuery } from "../../../shared/types/SearchQuery";
import { Patient } from "../../../shared/entity/Patient";

export interface IPatientDatastore {
    doesPatientExist(query: {
        field: "patientid" | "email",
        value: string
    }): Promise<boolean>;
    
    getAPatient(patientId: string): Promise<Patient[]>;

    getPatients(): Promise<Patient[]>;

    updatePatient(patientId: string, updatedPatient: Partial<Patient>): Promise<void>; 

    createPatient(newPatient: Patient): Promise<void>;

    searchPatients(query: SearchQuery): Promise<Patient[]>;
}