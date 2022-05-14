import { Token } from "../../../shared/types/Token";

/**
 * Authorization and Authentication Component For the Employee Patient Managament System
 */
export interface IAuthComponent {
        /**
     * Checks to see if the password given, matches the password saved in the database
     * @param employeeId The id of an employee
     * @param password The password to test
     */
    doPasswordsMatch(employeeId: string, password: string): Promise<boolean>;

    /**
     * Updates a password of a user
     * @param employeeId The id of the employee who's password will change
     * @param password The new Password
     */
    updatePassword(employeeId: string, password: string): Promise<void>;

    /**
     * Log a user in
     * @param userId The userid of the user 
     * @param password The password of the user
     */
    login(userId: string, password: string):Promise<string>;

    /**
     * Check to see if a user is authorized
     * @param auths Permissions that a user should have to be authorized
     * @param token The JWT that contains the permission levels of the user
     * @returns True if the user is authorized, false otherwise
     */
    isAuthorized(auths: string[], token: Token): Boolean;


}