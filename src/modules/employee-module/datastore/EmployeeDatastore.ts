import { SearchQuery } from "../../../shared/types/SearchQuery";
import { PostgresDriver } from "../../../drivers/PostgresDriver";
import { Employee } from "../../../shared/entity/Employee";
import { IEmployeeDatastore } from "../interfaces/IEmployeeDatastore";
import { buildCreateQuery, buildDoesFieldExistQuery, buildGetEntityQuery, buildSearchQuery, buildUpdateEntityQuery } from "../../../shared/functions/BuildQuery";

export class EmployeeDatastore implements IEmployeeDatastore {
    private client = PostgresDriver.client
    private static instance: IEmployeeDatastore;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new EmployeeDatastore();
        }
        return this.instance;
    }
    
    /**
     * @param query
     * @returns
     */
    async doesEmployeeExist(query: {
        field: "employeeid" | "userid" | 'email'
        value: string
    }): Promise<boolean> {
        const builtQuery = buildDoesFieldExistQuery('employee', query);
        console.log((await this.client.query(builtQuery)).rows)
        return (await this.client.query(builtQuery)).rows.length !== 0;
    }
    
    /**
     * 
     * @param employeeId 
     * @returns 
     */
    async getEmployee(employeeId: string): Promise<Employee[]> {
        const query = buildGetEntityQuery('employee', employeeId);
        const { rows } = await this.client.query(query)
        return rows;
    }
    
    /**
     * 
     * @returns 
     */
    async getEmployees(): Promise<Employee[]> {
        const query = buildGetEntityQuery('employee');
        const { rows } = await this.client.query(query);
        return rows
    }

    /**
     * 
     * @param employeeId 
     * @param updateEmployee 
     */
    async updateEmployee(employeeId: string, updateEmployee: Partial<Employee>): Promise<void> {
        const query = buildUpdateEntityQuery('employee', employeeId, updateEmployee);
        
        const { rows } = await this.client.query(query);
   
        return rows[0];
    }

    /**
     * 
     * @param newEmployee 
     */
    async createEmployee(newEmployee: Employee): Promise<void> {
        const query = buildCreateQuery(newEmployee);
        const res = await this.client.query(query);
        console.log(res.rows);
    }

    /**
     * 
     * @param searchQuery 
     */
    async searchEmployees(searchQuery: SearchQuery): Promise<Employee[]> {
        const query = buildSearchQuery(searchQuery,  'employee');
        const { rows } = await this.client.query(query);
        console.log(rows);
        return rows;
    }

}
