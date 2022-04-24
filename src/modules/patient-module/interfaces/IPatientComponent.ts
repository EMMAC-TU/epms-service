import { PatientCreation } from "../../../shared/types/PatientCreation";
import { Patient } from "../../../shared/entity/Patient";
import { SearchQuery } from "../../../shared/types/SearchQuery";

export interface IPatientComponent {
    getPatients(): Promise<Patient[]>;
    getAPatient(patientid: string): Promise<Patient>;
    updatePatient(patientid: string, updatePatient: Partial<Patient>): Promise<void>; 
    createPatient(patient: PatientCreation): Promise<Patient>;
    searchPatients(query: SearchQuery): Promise<Patient[]>;
}