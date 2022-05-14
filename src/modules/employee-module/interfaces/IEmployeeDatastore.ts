import { SearchQuery } from "../../../shared/types/SearchQuery";
import { Employee } from "../../../shared/entity/Employee";

export interface IEmployeeDatastore {
    /**
     * @param query
     */
    doesEmployeeExist(query: {
        field: "employeeid" | "userid" | 'email'
        value: string
    }): Promise<boolean>;

    /**
     * 
     * @param employeeId 
     */
    getEmployee(employeeId: string): Promise<Employee[]>;

    /**
     * 
     */
    getEmployees(): Promise<Employee[]>;

    /**
     * 
     * @param employeeId 
     * @param updateEmployee 
     */
    updateEmployee(employeeId: string, updateEmployee: Partial<Employee>): Promise<void>;


    /**
     * 
     * @param newEmployee 
     */
    createEmployee(newEmployee: Employee): Promise<void>;

    /**
     * 
     * @param query 
     */
    searchEmployees(query: SearchQuery): Promise<{ employees: any[], count: number}>

}