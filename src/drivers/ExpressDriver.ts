import { EmployeeRouteHandler } from "../modules/employee-module/EmployeeRouteHandler";
import { AuthRouteHandler } from "../modules/auth-module/AuthRouteHandler";
import { PatientRouteHandler } from "../modules/patient-module/PatientRouteHandler";
import cors from "cors";
import helmet from 'helmet';
import express = require('express');
import cookieParser = require('cookie-parser');
import { HttpErrorParser } from "../middlewares/HttpErrorParser";

const version = require('../../package.json').version

export class ExpressDriver {
    public static app = express();
    
    public static build() {
        return this.buildDriver();
    }

    private static buildDriver() {
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(cors({ origin: true, credentials: true }))
        this.app.use(cookieParser());
        
        this.initServer();
        this.app.use(EmployeeRouteHandler.buildRouter());
        this.app.use(AuthRouteHandler.buildRouter());
        this.app.use(PatientRouteHandler.buildRouter());
        this.app.use(HttpErrorParser);
        return this.app;
    }

    private static initServer() {
        this.app.get("/", (req, res) => {
            res.json({ message: `Welcome to the Employee-Patient-Management-Service Version ${version}`});
        });
    }
}