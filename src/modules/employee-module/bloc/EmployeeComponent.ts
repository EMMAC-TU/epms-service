import { Employee } from "../../../shared/entity/Employee";
import { IEmployeeComponent } from "../interfaces/IEmployeeComponent";
import { EmployeeDatastore } from "../datastore/EmployeeDatastore";
import { EmployeeCreation } from "../../../shared/types/EmployeeCreation";
import { BcryptDriver } from "../../../drivers/BcryptDriver";
import { 
        validatePasswordCriteria, 
        validateEmailCriteria,
        validatePhoneNumbers, 
        verifyUpdateFields, 
        validateUndefinedNullFields, 
        isValidUUID, 
        validateGender
    } from "../../../shared/functions/validator";
import { SearchQuery } from "../../../shared/types/SearchQuery";
import { ResourceError, ResourceErrorReason } from "../../../shared/types/Errors";

const POSITIONS = {
    ADMIN: 'administrator',
    DOCTOR: 'doctor',
    NURSE: 'nurse',
    VENDOR: 'vendor',
    RECEPTIONIST: 'receptionist',
    ACCOUNTANT: 'accountant'
};

/**
 * Employee Component handles all business logic for the Employee Module
 */
export class EmployeeComponent implements IEmployeeComponent{
    private static instance: IEmployeeComponent;

    /**
     * Gets the instance of the employee component
     * @returns The instance of an EmployeeComponent
     */
    public static getInstance(): IEmployeeComponent {
        if (!this.instance) {
            this.instance = new EmployeeComponent();
        }
        return this.instance;
    }

    /**
     * Gets an employee by employee id 
     * @param employeeID employee id of the employee to get
     */
    async getEmployee(employeeID: string): Promise<Employee> {
        if(!isValidUUID(employeeID)) {
            throw new ResourceError("Employee Id is not valid", ResourceErrorReason.BAD_REQUEST);
        }
        const emp = await EmployeeDatastore.getInstance().getEmployee(employeeID);
        if (emp.length == 0) {
            throw new ResourceError("Employee Not Found", ResourceErrorReason.NOT_FOUND);
        }
        return emp[0];
    }

    /**
     * Get all employees
     * @returns An array of employees
     */
    async getEmployees(): Promise<Employee[]> {
        return await EmployeeDatastore.getInstance().getEmployees();
    }

    /**
     * Creates a new Employee 
     * @param newEmployee The new employee
     */
    async createEmployee(newEmployee: EmployeeCreation): Promise<Employee> {
        if (this.isMissingRequiredFields(newEmployee)) {
            throw new ResourceError("Missing a field", ResourceErrorReason.BAD_REQUEST);
        }
        if (await EmployeeDatastore.getInstance().doesEmployeeExist({ field: 'userid', value: newEmployee.userid })) {
            throw new ResourceError("Username already exists", ResourceErrorReason.BAD_REQUEST);
        }
        if (await EmployeeDatastore.getInstance().doesEmployeeExist({ field: 'email', value: newEmployee.email.toLowerCase() })) {
            throw new ResourceError("Email already exists", ResourceErrorReason.BAD_REQUEST);
        }

        this.validateInput(newEmployee);
        const hasher = new BcryptDriver();
        newEmployee.password =  await hasher.saltPassword(newEmployee.password);
        const employee = new Employee(newEmployee);

        await EmployeeDatastore.getInstance().createEmployee(employee);

        delete employee.password;

        return employee;
    }

    /**
     * Updates an employee
     * @param employeeId The id of the employee to be updated
     * @param updatedEmployee Partial employee object that contains the fields to update
     */
    async updateEmployee(employeeId: string, updatedEmployee: Partial<Employee>): Promise<void> {
        if (!(await EmployeeDatastore.getInstance().doesEmployeeExist({ field: 'employeeid', value: employeeId }))) {
            throw new ResourceError("Employee does not exist", ResourceErrorReason.NOT_FOUND);
        }
        verifyUpdateFields(updatedEmployee, ['employeeid', 'startdate']);
        if (updatedEmployee.userid) {
            const employee = (await EmployeeDatastore.getInstance().getEmployee(employeeId))[0] as Employee;
            if (updatedEmployee.userid === employee.userid){
                throw new ResourceError('Username is the same', ResourceErrorReason.BAD_REQUEST);
            }
        }
        if (updatedEmployee.password) {
            validatePasswordCriteria(updatedEmployee.password);
            const hasher = new BcryptDriver();
            updatedEmployee.password = await hasher.saltPassword(updatedEmployee.password);
        }
        
        await EmployeeDatastore.getInstance().updateEmployee(employeeId, updatedEmployee);
    }

    /**
     * Finds employees based on a search query
     * @param query An array of employees 
     */
    async findEmployees(query: SearchQuery): Promise<{ employees: any[], count: number}> {
        if (query.employeeid && !isValidUUID(query.employeeid)) {
            return { employees: [], count: 0 };
        }
        return await EmployeeDatastore.getInstance().searchEmployees(query);
    }

    /**
     * Checks to see if the required fields are given
     * @param newEmp The new employee
     * @returns True if all required fields are applied, false otherwised
     */
    private isMissingRequiredFields(newEmp: EmployeeCreation) {
        return !(
            newEmp.dateofbirth && 
            newEmp.firstname && 
            newEmp.lastname && 
            newEmp.userid &&
            newEmp.password &&
            newEmp.position)
    }


    /**
     * Validates the input of a new employee 
     * @param newEmp The new employee
     */
    private validateInput(newEmp: EmployeeCreation) {
        validatePasswordCriteria(newEmp.password);
        validateEmailCriteria(newEmp.email);
        newEmp = validateUndefinedNullFields(newEmp);
        if(newEmp.middleinitial && newEmp.middleinitial.length > 1){
            throw new ResourceError("Middle Initial Should be Length 1", ResourceErrorReason.BAD_REQUEST);
        }
        
        if(newEmp.position !== POSITIONS.ADMIN &&
            newEmp.position !== POSITIONS.DOCTOR &&
            newEmp.position !== POSITIONS.NURSE &&
            newEmp.position !== POSITIONS.RECEPTIONIST &&
            newEmp.position !== POSITIONS.VENDOR &&
            newEmp.position !== POSITIONS.ACCOUNTANT){
            throw new ResourceError("Position of employee is not valid", ResourceErrorReason.BAD_REQUEST);
        }
        
        validatePhoneNumbers(newEmp);

        // Make userid lowercase
        newEmp.userid = newEmp.userid.toLowerCase();

        // Match Gender
        validateGender(newEmp);
        
        return true
    }

    


}