import { SearchQuery } from "../../../shared/types/SearchQuery";
import { Employee } from "../../../shared/entity/Employee";

/**
 * Employee Component handles all business logic for the Employee Module
 */
export interface IEmployeeComponent {
    /**
     * Gets an employee by employee id 
     * @param employeeID employee id of the employee to get
     */
    getEmployee(employeeID: string): Promise<Employee>;

    /**
     * Get all employees
     * @returns An array of employees
     */
    getEmployees(): Promise<Employee[]>;

    /**
     * Creates a new Employee 
     * @param newEmployee The new employee
     */
    createEmployee(newEmployee: Employee): Promise<Employee>;

    /**
     * Updates an employee
     * @param employeeId The id of the employee to be updated
     * @param updatedEmployee Partial employee object that contains the fields to update
     */
    updateEmployee(employeeId: string, updatedEmployee: Partial<Employee>): Promise<void>;

    /**
     * Finds employees based on a search query
     * @param query An array of employees 
     */
    findEmployees(query: SearchQuery): Promise<{ employees: any[], count: number}>;

}