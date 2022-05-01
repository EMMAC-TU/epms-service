import { ResourceError, ResourceErrorReason } from "../../../shared/types/Errors";
import { BcryptDriver } from "../../../drivers/BcryptDriver";
import { Employee } from "../../../shared/entity/Employee";
import { AuthDatastore } from "../datastore/AuthDatastore";
import { IAuthComponent } from "../interfaces/IAuthComponent";
import { generateToken } from "./functions/GenerateToken";
import { IEmployee } from "../../../shared/interfaces/IEmployee";
import { EmployeeDatastore } from "../../../modules/employee-module/datastore/EmployeeDatastore";
import { validatePasswordCriteria } from "../../../shared/functions/validator";

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
    async login(userId: string, password: string): Promise<{ employee: IEmployee, token:string }> {
        const employee = await AuthDatastore.getInstance().login(userId);
        if (!employee) {
            throw new ResourceError(`User with ${userId} was not found`, ResourceErrorReason.INVALID_ACCESS);
        }
        const match = await this.bcrypt.comparePasswords(password, employee.password);
        if (!match) {
            throw new ResourceError('Password is incorrect', ResourceErrorReason.INVALID_ACCESS);
        }
        const token = generateToken(employee);
        
        delete employee.password;

        return { employee, token };
    }
    

    
}