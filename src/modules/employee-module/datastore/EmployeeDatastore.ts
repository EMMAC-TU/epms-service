import { SearchQuery } from "../../../shared/types/SearchQuery";
import { PostgresDriver } from "../../../drivers/PostgresDriver";
import { Employee } from "../../../shared/entity/Employee";
import { IEmployeeDatastore } from "../interfaces/IEmployeeDatastore";
import { buildCreateQuery, buildDoesFieldExistQuery, buildGetEntityQuery, buildSearchQuery, buildUpdateEntityQuery } from "../../../shared/functions/BuildQuery";

/**
 * The Datastore of the employee module
 */
export class EmployeeDatastore implements IEmployeeDatastore {
    private client = PostgresDriver.client
    private static instance: IEmployeeDatastore;

    /**
     * Gets the singleton instance of the employee datastore
     * @returns A singleton of the employee datastore
     */
    public static getInstance() {
        if (!this.instance) {
            this.instance = new EmployeeDatastore();
        }
        return this.instance;
    }
    
    /**
     * Checks to see if an employee exists
     * @param query the query to make to the database
     * @returns true if the employee exists, false otherwise
     */
    async doesEmployeeExist(query: {
        field: "employeeid" | "userid" | 'email'
        value: string
    }): Promise<boolean> {
        const builtQuery = buildDoesFieldExistQuery('employee', query);

        return (await this.client.query(builtQuery)).rows.length !== 0;
    }
    
    /**
     * Get an employee by employee id
     * @param employeeId The employee id
     * @returns the employee
     */
    async getEmployee(employeeId: string): Promise<Employee[]> {
        const query = buildGetEntityQuery('employee', employeeId);

        const { rows } = await this.client.query(query)
        return rows;
    }
    
    /**
     * Get all employees
     * @returns An array of employees
     */
    async getEmployees(): Promise<Employee[]> {
        const query = buildGetEntityQuery('employee');

        const { rows } = await this.client.query(query);
        return rows
    }

    /**
     * Update an employee
     * @param employeeId The id of the employoee to update
     * @param updateEmployee Updated fields of the employee
     */
    async updateEmployee(employeeId: string, updateEmployee: Partial<Employee>): Promise<void> {
        const query = buildUpdateEntityQuery('employee', employeeId, updateEmployee);

        const { rows } = await this.client.query(query);
   
        return rows[0];
    }

    /**
     * Create an employee
     * @param newEmployee new employee  
     */
    async createEmployee(newEmployee: Employee): Promise<void> {
        const query = buildCreateQuery(newEmployee);

        await this.client.query(query);
    }

    /**
     * Search employees based on a query
     * @param searchQ Search Query
     */
    async searchEmployees(searchQ: SearchQuery): Promise<{ employees: any[], count: number}> {
        const { searchQuery, countQuery } = buildSearchQuery(searchQ,  'employee');

        const { rows } = await this.client.query(searchQuery);
        const count = await this.countQuery(countQuery);
        
        return { employees: rows, count };
    }

    /**
     * Gets the number of rows based on a query
     * @param countQuery Count Query
     * @returns the number of rows returned based on the query
     */
    private async countQuery(countQuery: { text: string, values: string[] }): Promise<number> {
        const { rows } = await this.client.query(countQuery);
        return Number(rows[0].count);
    }

}
