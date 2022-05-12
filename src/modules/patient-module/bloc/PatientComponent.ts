import { ResourceError, ResourceErrorReason } from "../../../shared/types/Errors";
import { Patient } from "../../../shared/entity/Patient";
import { PatientCreation } from "../../../shared/types/PatientCreation";
import { SearchQuery } from "../../../shared/types/SearchQuery";
import { PatientDatastore } from "../datastore/PatientDatastore";
import { IPatientComponent } from "../interfaces/IPatientComponent";
import { verifyUpdateFields, validatePhoneNumbers, validateEmailCriteria, isValidUUID, validateGender } from "../../../shared/functions/validator";

export class PatientComponent implements IPatientComponent {
    private static instance: IPatientComponent;

    public static getInstance(): IPatientComponent {
        if (!this.instance) {
            this.instance = new PatientComponent();
        }

        return this.instance;
    }

    /**
     * 
     * @returns 
     */
    async getPatients(): Promise<Patient[]> {
        return await PatientDatastore.getInstance().getPatients();
    }

    /**
     * 
     * @param patientid 
     * @returns 
     */
    async getAPatient(patientid: string): Promise<Patient> {
        if(!isValidUUID(patientid)) {
            throw new ResourceError("Employee Id is not valid", ResourceErrorReason.BAD_REQUEST);
        }
        const patient = await PatientDatastore.getInstance().getAPatient(patientid);
        if (patient.length === 0) {
            throw new ResourceError('Patient Does not exist', ResourceErrorReason.NOT_FOUND);
        }
        return patient[0] as Patient;
    }

    /**
     * 
     * @param patientid 
     * @param updatePatient 
     */
    async updatePatient(patientid: string, updatePatient: Partial<Patient>): Promise<void> {
        if(!(await PatientDatastore.getInstance().doesPatientExist({ field: 'patientid', value: patientid }))) {
            throw new ResourceError('Patient does not exist', ResourceErrorReason.NOT_FOUND);
        }
        verifyUpdateFields(updatePatient, ['patientid', 'creationdate']);
        await PatientDatastore.getInstance().updatePatient(patientid, updatePatient);
    }

    /**
     * 
     * @param patient 
     */
    async createPatient(patient: PatientCreation): Promise<Patient> {
        if (this.isMissingRequiredFields(patient)) {
            throw new ResourceError('Missing a required field', ResourceErrorReason.BAD_REQUEST);
        }
        if (await PatientDatastore.getInstance().doesPatientExist({ field: 'email', value: patient.email })) {
            throw new ResourceError('Patient with this email already exists', ResourceErrorReason.BAD_REQUEST);
        }
        this.validateInput(patient);
        const newPatient = new Patient(patient);
        await PatientDatastore.getInstance().createPatient(newPatient);

        return newPatient;
    }

    /**
     * 
     * @param query 
     */
    async searchPatients(query: SearchQuery): Promise<Patient[]> {
        if (query.patientid && !isValidUUID(query.patientid)) {
            return [];
        }
        return await PatientDatastore.getInstance().searchPatients(query);
    }

    private isMissingRequiredFields(patient: PatientCreation) {
        return !(
            patient.dateofbirth && 
            patient.firstname && 
            patient.lastname )
    }

    private validateInput(newPatient: PatientCreation) {
        validatePhoneNumbers(newPatient);
        validateEmailCriteria(newPatient.email);
        validateGender(newPatient);
        if (newPatient.middleinitial && newPatient.middleinitial.length > 1) {
            throw new ResourceError("Middle Initial requires length 1", ResourceErrorReason.BAD_REQUEST);
        }
    }
    
}