import { buildLoginQuery, buildPasswordQuery, buildUpdatePasswordQuery } from "../../../shared/functions/BuildQuery";
import { Employee } from "../../../shared/entity/Employee";
import { IAuthDatastore } from "../interfaces/IAuthDatastore";
import { PostgresDriver } from "../../../drivers/PostgresDriver";

/**
 * Datastore for the Authentication and Authorization Module
 */
export class AuthDatastore implements IAuthDatastore {
    private static instance: IAuthDatastore;
    private client = PostgresDriver.client;

    /**
     * Gets the instance of the AuthDatastore
     * @returns Returns a singleton instance of the AuthDatastore
     */
    public static getInstance(): IAuthDatastore {
        if (!this.instance) {
            this.instance = new AuthDatastore();
        }
        return this.instance;
    }

    /**
     * Query for logging a user in
     * @param userid The user id of the user attempting to login
     * @returns A user if they exist
     */
    async login(userid: string): Promise<Employee> {
        const query = buildLoginQuery(userid);
        return (await this.client.query(query)).rows[0] as Employee;
    }

    /**
     * Gets the password of an employee
     * @param employeeid id of an employee
     * @returns the password of an employee
     */
    async getPassword(employeeid: string): Promise<string> {
        const query = buildPasswordQuery(employeeid);
        return (await this.client.query(query)).rows[0].password
    }

    /**
     * Query to update a users password
     * @param employeeid The id of the employee who is updating their password
     * @param password The new password
     */
    async updatePassword(employeeid: string, password: string): Promise<void> {
        const query = buildUpdatePasswordQuery(employeeid, password);
        await this.client.query(query);
    }
}