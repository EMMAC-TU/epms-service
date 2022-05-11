import { ResourceError, ResourceErrorReason } from "../../../shared/types/Errors";
import { BcryptDriver } from "../../../drivers/BcryptDriver";
import { Employee } from "../../../shared/entity/Employee";
import { AuthDatastore } from "../datastore/AuthDatastore";
import { IAuthComponent } from "../interfaces/IAuthComponent";
import { generateToken } from "./functions/GenerateToken";
import { IEmployee } from "../../../shared/interfaces/IEmployee";
import { EmployeeDatastore } from "../../../modules/employee-module/datastore/EmployeeDatastore";
import { validatePasswordCriteria } from "../../../shared/functions/validator";
import { Token } from "../../../shared/types/Token";

export class AuthComponent implements IAuthComponent {
    private static instance: IAuthComponent;
    private bcrypt: BcryptDriver = new BcryptDriver();

    public static getInstance() {
        if (!this.instance) {
            this.instance = new AuthComponent();
        }
        return this.instance;
    }
    
    /**
     * 
     * @param employeeId 
     * @param password 
     */
    async doPasswordsMatch(employeeId: string, password: string): Promise<boolean> {
        if ( !(await EmployeeDatastore.getInstance().doesEmployeeExist({ field: 'employeeid', value: employeeId }))) {
            throw new ResourceError("Employee does not exist", ResourceErrorReason.NOT_FOUND);
        }
        const currPassword = await AuthDatastore.getInstance().getPassword(employeeId);
        return (await this.bcrypt.comparePasswords(password, currPassword));
    }

    /**
     * 
     * @param employeeId 
     * @param password 
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
     * 
     * @param userId 
     * @param password 
     */
    async login(userId: string, password: string): Promise<string> {
        const employee = await AuthDatastore.getInstance().login(userId.toLowerCase());
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
     * 
     * @param auths 
     * @param token 
     * @returns 
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