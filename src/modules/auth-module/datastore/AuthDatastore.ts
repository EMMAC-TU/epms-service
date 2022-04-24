import { buildLoginQuery, buildPasswordQuery, buildUpdatePasswordQuery } from "../../../shared/functions/BuildQuery";
import { Employee } from "../../../shared/entity/Employee";
import { IAuthDatastore } from "../interfaces/IAuthDatastore";
import { PostgresDriver } from "../../../drivers/PostgresDriver";

export class AuthDatastore implements IAuthDatastore {
    private static instance: IAuthDatastore;
    private client = PostgresDriver.client;

    public static getInstance(): IAuthDatastore {
        if (!this.instance) {
            this.instance = new AuthDatastore();
        }
        return this.instance;
    }

    async login(userid: string): Promise<Employee> {
        const query = buildLoginQuery(userid);
        return (await this.client.query(query)).rows[0] as Employee;
    }

    async getPassword(employeeid: string): Promise<string> {
        const query = buildPasswordQuery(employeeid);
        return (await this.client.query(query)).rows[0].password
    }

    async updatePassword(employeeid: string, password: string): Promise<void> {
        const query = buildUpdatePasswordQuery(employeeid, password);
        await this.client.query(query);
    }
}