import { ResourceError, ResourceErrorReason } from "../../../shared/types/Errors";
import { BcryptDriver } from "../../../drivers/BcryptDriver";
import { AuthDatastore } from "../datastore/AuthDatastore";
import { IAuthComponent } from "../interfaces/IAuthComponent";
import { generateToken } from "./functions/GenerateToken";
import { EmployeeDatastore } from "../../../modules/employee-module/datastore/EmployeeDatastore";
import { validatePasswordCriteria } from "../../../shared/functions/validator";
import { Token } from "../../../shared/types/Token";

/**
 * Authorization and Authentication Component For the Employee Patient Managament System
 */
export class AuthComponent implements IAuthComponent {
    private static instance: IAuthComponent;
    private bcrypt: BcryptDriver = new BcryptDriver();

    /**
     * Gets an instance of the Authcomponent
     * @returns A singleton instance of the AuthComponent
     */
    public static getInstance() {
        if (!this.instance) {
            this.instance = new AuthComponent();
        }
        return this.instance;
    }
    
    /**
     * Checks to see if the password given, matches the password saved in the database
     * @param employeeId The id of an employee
     * @param password The password to test
     */
    async doPasswordsMatch(employeeId: string, password: string): Promise<boolean> {
        if ( !(await EmployeeDatastore.getInstance().doesEmployeeExist({ field: 'employeeid', value: employeeId }))) {
            throw new ResourceError("Employee does not exist", ResourceErrorReason.NOT_FOUND);
        }
        const currPassword = await AuthDatastore.getInstance().getPassword(employeeId);
        return (await this.bcrypt.comparePasswords(password, currPassword));
    }

    /**
     * Updates a password of a user
     * @param employeeId The id of the employee who's password will change
     * @param password The new Password
     */
    async updatePassword(employeeId: string, password: string): Promise<void> {
        if ( !(await EmployeeDatastore.getInstance().doesEmployeeExist({ field: 'employeeid', value: employeeId }))) {
            throw new ResourceError("Employee does not exist", ResourceErrorReason.NOT_FOUND);
        }
        validatePasswordCriteria(password);
        const hashedPassword = await this.bcrypt.saltPassword(password);
        await AuthDatastore.getInstance().updatePassword(employeeId, hashedPassword);
    }
    
    /**
     * Log a user in
     * @param userId The userid of the user 
     * @param password The password of the user
     */
    async login(userId: string, password: string): Promise<string> {
        const employee = await AuthDatastore.getInstance().login(userId);
        if (!employee) {
            throw new ResourceError(`User with ${userId} was not found`, ResourceErrorReason.BAD_REQUEST);
        }
        const match = await this.bcrypt.comparePasswords(password, employee.password);
        if (!match) {
            throw new ResourceError('Password is incorrect', ResourceErrorReason.BAD_REQUEST);
        }
        const token = generateToken(employee);
        
        delete employee.password;

        return token;
    }

    /**
     * Check to see if a user is authorized
     * @param auths Permissions that a user should have to be authorized
     * @param token The JWT that contains the permission levels of the user
     * @returns True if the user is authorized, false otherwise
     */
    isAuthorized(auths: string[], token: Token): Boolean {
        let isAuthorized = false;
        auths.forEach((val) => {
            if (val === token.permission) {
                isAuthorized = true;
            }
        });
        return isAuthorized;
    }
    

    
}