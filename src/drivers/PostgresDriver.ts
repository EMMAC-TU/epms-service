import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { ServiceError, ServiceErrorReason } from '../shared/types/Errors';

dotenv.config()

/**
 * The driver for the postgres object 
 */
export class PostgresDriver {
    private static _client: Client;

    private constructor() {}

    /**
     * Connects to the postgres database
     */
    public static async connect(): Promise<void> {
        try {
            if (!this._client) {
                this._client = new Client(process.env.DB_URI);
                await this._client.connect();
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Disconnects from the database
     */
    public static async disconnect(): Promise<void> {
        if (this._client) {
            this._client.end()
        }
    }

    /**
     * Gets the client
     */
    static get client(): Client {
        if (!this._client) {
            throw new ServiceError("Connection to PostgresDB has not been established", ServiceErrorReason.INTERNAL);
        }
        return this._client
    }
}
