import { SearchQuery } from "../../../shared/types/SearchQuery";
import { Employee } from "../../../shared/entity/Employee";

export interface IEmployeeComponent {
    /**
     * 
     * @param employeeID 
     */
    getEmployee(employeeID: string): Promise<Employee>;

    getEmployees(): Promise<Employee[]>;

    /**
     * 
     * @param newEmployee 
     */
    createEmployee(newEmployee: Employee): Promise<Employee>;

    /**
     * 
     * @param employeeId 
     * @param updatedEmployee 
     */
    updateEmployee(employeeId: string, updatedEmployee: Partial<Employee>): Promise<void>;

    /**
     * 
     * @param query 
     */
    findEmployees(query: SearchQuery): Promise<Employee[]>;
}