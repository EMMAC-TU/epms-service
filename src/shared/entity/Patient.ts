import { generateUUID } from "../functions/generateUUID";
import { IPatient } from "../interfaces/IPatient";
import { PatientCreation } from "../types/PatientCreation";

export class Patient implements IPatient {
    patientID: string;
    height?: number;
    weight?: number;
    firstName?: string;
    lastName?: string;
    gender?: string;
    outpatient?: boolean;
    creationdate: Date;
    dateofbirth?: string;
    middleInitial?: string;
    email?: string;
    homephone?: string;
    mobilephone?: string;
    workphone?: string;
    insurance_companyName?: string;
    insurance_memberId?: string;
    insurance_groupNumber?: string;
    streetname1?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
    streetname2?: string;
    nok_mobilephone?: string;
    nok_firstname?: string;
    nok_lastname?: string;

    constructor(patientForm: PatientCreation) {
        this.patientID = generateUUID();
        this.height = patientForm.height;
        this.weight = patientForm.weight;
        this.firstName = patientForm.firstname;
        this.lastName = patientForm.lastname;
        this.dateofbirth = patientForm.dateofbirth;
        this.gender = patientForm.gender;
        this.outpatient = true; // Change this to patientForm.outpatient when inpatient is a thing
        this.creationdate = new Date();
        this.middleInitial = patientForm.middleinitial;
        this.email = patientForm.email;
        this.homephone = patientForm.homephone;
        this.mobilephone = patientForm.mobilephone;
        this.workphone = patientForm.workphone;
        this.insurance_companyName = patientForm.insurance_companyname;
        this.insurance_memberId = patientForm.insurance_memberid;
        this.insurance_groupNumber = patientForm.insurance_groupnumber;
        this.streetname1 = patientForm.streetname1;
        this.city = patientForm.city;
        this.state = patientForm.state;
        this.zipcode = patientForm.zipcode;
        this.country = patientForm.country;
        this.streetname2 = patientForm.streetname2;
        this.nok_mobilephone = patientForm.nok_mobilephone;
        this.nok_firstname = patientForm.nok_firstname;
        this.nok_lastname = patientForm.nok_lastname;
    }
}