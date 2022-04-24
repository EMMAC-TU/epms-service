import { Employee } from "../../../shared/entity/Employee";

export interface IAuthDatastore {
    login(userid: string): Promise<Employee>;
    getPassword(employeeid: string): Promise<string>;
    updatePassword(employeeid: string, password: string): Promise<void>;
}