import { generateUUID } from "../functions/generateUUID";
import { IEmployee } from "../interfaces/IEmployee";
import { EmployeeCreation } from "../types/EmployeeCreation";

export class Employee implements IEmployee {
    userid?: string;
    firstname?: string;
    middleinitial?: string;
    lastname?: string;
    gender?: string;
    email?: string;
    position?: string;
    streetname1?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
    streetname2?: string;
    employeeid?: string;
    password?: string;
    dateofbirth?: Date | string;
    homephone?: string;
    mobilephone?: string;
    workphone?: string;
    startdate?: string;
    enddate?: string;
    
    constructor(info: EmployeeCreation) {
        this.userid = info.userid;
        this.password = info.password; 
        this.firstname = info.firstname;
        this.lastname = info.lastname;
        this.gender = info.gender;
        this.email = info.email.toLowerCase();
        this.streetname1 = info.streetname1;
        this.streetname2 = info.streetname2;
        this.city = info.city;
        this.state = info.state;
        this.zipcode = info.zipcode;
        this.country = info.country;
        this.position = info.position;
        this.employeeid = generateUUID();
        this.middleinitial = info.middleinitial;
        this.dateofbirth = info.dateofbirth;
        this.homephone = info.homephone;
        this.mobilephone = info.mobilephone;
        this.workphone = info.workphone;
        this.startdate = new Date().toDateString()
    }
}