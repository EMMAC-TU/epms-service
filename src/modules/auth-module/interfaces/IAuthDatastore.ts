import { Employee } from "../../../shared/entity/Employee";

export interface IAuthDatastore {

    /**
     * Query for logging a user in
     * @param userid The user id of the user attempting to login
     * @returns A user if they exist
     */
    login(userid: string): Promise<Employee>;

    /**
     * Gets the password of an employee
     * @param employeeid id of an employee
     * @returns the password of an employee
     */
    getPassword(employeeid: string): Promise<string>;

    /**
     * Query to update a users password
     * @param employeeid The id of the employee who is updating their password
     * @param password The new password
     */
    updatePassword(employeeid: string, password: string): Promise<void>;
}