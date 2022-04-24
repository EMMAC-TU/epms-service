import { NextFunction, Request, Response, Router } from "express";
import { getSearchQuery } from "../../shared/functions/getSearchQuery";
import { PatientCreation } from "../../shared/types/PatientCreation";
import { ResourceError, ResourceErrorReason } from "../../shared/types/Errors";
import { PatientComponent } from "./bloc/PatientComponent";
import { Patient } from "../../shared/entity/Patient";

export class PatientRouteHandler {
    public static buildRouter() {
        const router = Router();

        router.get('/patients', this.getPatients);
        router.get('/patients/search', this.searchPatients);
        router.post('/patients', this.createPatient);
        router.get('/patients/:id', this.getAPatient);
        router.patch('/patients/:id', this.updatePatient);
        
        return router;
    }

    // add auth
    static async updatePatient(req: Request, res: Response, next: NextFunction) {
        try {
            const patientid = req.params.id;
            if(!patientid) {
                throw new ResourceError('Patient id was not provided', ResourceErrorReason.BAD_REQUEST);
            }   

            const patient = req.body as Partial<Patient>;
            await PatientComponent.getInstance().updatePatient(patientid, patient);
            
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }

    // add auth
    static async getAPatient(req: Request, res: Response, next: NextFunction) {
        try {
            const patientid = req.params.id;
            if(!patientid) {
                throw new ResourceError("Patient Id was not provided", ResourceErrorReason.BAD_REQUEST);
            }
            const patient = await PatientComponent.getInstance().getAPatient(patientid);
            res.json(patient);
        } catch (err) {
            next(err);
        }
    }

    // add auth
    static async createPatient(req: Request, res: Response, next: NextFunction) {
        try {
            const newPat = req.body as PatientCreation;
            const pat = await PatientComponent.getInstance().createPatient(newPat);
            res.json(pat);
        } catch (err) {
            next(err);
        }
    }

    // add auth
    static async searchPatients(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.query) {
                throw new ResourceError("Query not provided", ResourceErrorReason.INTERNAL_SERVER_ERROR);
            }
            const params = getSearchQuery(req);
            const patients = await PatientComponent.getInstance().searchPatients(params);

            res.json(patients);
        } catch (err) {
            next(err);
        }
    }

    // add auth
    static async getPatients(req: Request, res: Response, next: NextFunction) {
        try {
            const results = await PatientComponent.getInstance().getPatients();
            res.json(results);
        } catch (err) {
            next(err);
        }
    }
}