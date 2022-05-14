import { SearchQuery } from "../../../shared/types/SearchQuery";
import { Employee } from "../../../shared/entity/Employee";

/**
 * The Datastore of the employee module
 */
export interface IEmployeeDatastore {

    /**
     * Checks to see if an employee exists
     * @param query the query to make to the database
     * @returns true if the employee exists, false otherwise
     */
    doesEmployeeExist(query: {
        field: "employeeid" | "userid" | 'email'
        value: string
    }): Promise<boolean>;

    /**
     * Get an employee by employee id
     * @param employeeId The employee id
     * @returns the employee
     */
    getEmployee(employeeId: string): Promise<Employee[]>;

    /**
     * Get all employees
     * @returns An array of employees
     */
    getEmployees(): Promise<Employee[]>;

    /**
     * Update an employee
     * @param employeeId The id of the employoee to update
     * @param updateEmployee Updated fields of the employee
     */
    updateEmployee(employeeId: string, updateEmployee: Partial<Employee>): Promise<void>;


    /**
     * Create an employee
     * @param newEmployee new employee  
     */
    createEmployee(newEmployee: Employee): Promise<void>;

    /**
     * Search employees based on a query
     * @param searchQ Search Query
     */
    searchEmployees(query: SearchQuery): Promise<{ employees: any[], count: number}>

}