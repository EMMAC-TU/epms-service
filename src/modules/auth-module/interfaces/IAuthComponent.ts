import { IEmployee } from "../../../shared/interfaces/IEmployee";

export interface IAuthComponent {
    /**
     * 
     * @param employeeId 
     * @param password 
     */
    doPasswordsMatch(employeeId: string, password: string): Promise<boolean>;

    /**
     * 
     * @param employeeId 
     * @param password 
     */
    updatePassword(employeeId: string, password: string): Promise<void>;

    /**
     * 
     * @param userId 
     * @param password 
     */
    login(userId: string, password: string):Promise<string>;


}