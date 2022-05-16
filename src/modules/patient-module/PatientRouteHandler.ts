import { NextFunction, Request, Response, Router } from "express";
import { getSearchQuery } from "../../shared/functions/getSearchQuery";
import { PatientCreation } from "../../shared/types/PatientCreation";
import { ResourceError, ResourceErrorReason } from "../../shared/types/Errors";
import { PatientComponent } from "./bloc/PatientComponent";
import { Patient } from "../../shared/entity/Patient";
import { Authorized } from "../../shared/decorators/Authorize";
import { PermissionLevels } from "../../shared/types/PermissionLevels";

/**
 * Route Handler for the Patient Module
 */
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

    @Authorized({
        permissions: [
            PermissionLevels.ADMIN,
            PermissionLevels.DOCTOR,
            PermissionLevels.NURSE,
            PermissionLevels.RECEPTIONIST
        ]
    })
    static async updatePatient(req: Request, res: Response, next: NextFunction) {
        try {
            const patientid = req.params.id;
            if(!patientid) {
                throw new ResourceError('Patient ID was not provided', ResourceErrorReason.BAD_REQUEST);
            }   

            const patient = req.body as Partial<Patient>;
            await PatientComponent.getInstance().updatePatient(patientid, patient);
            
            res.status(200).json({msg: "Patient Updated"});
        } catch (err) {
            next(err);
        }
    }

    @Authorized({
        permissions: [
            PermissionLevels.ADMIN,
            PermissionLevels.DOCTOR,
            PermissionLevels.NURSE,
            PermissionLevels.RECEPTIONIST,
            PermissionLevels.VENDOR,
            PermissionLevels.ACCOUNTANT
        ]
    })
    static async getAPatient(req: Request, res: Response, next: NextFunction) {
        try {
            const patientid = req.params.id;
            if(!patientid) {
                throw new ResourceError("Patient ID was not provided", ResourceErrorReason.BAD_REQUEST);
            }
            const patient = await PatientComponent.getInstance().getAPatient(patientid);
            res.json(patient);
        } catch (err) {
            next(err);
        }
    }

    @Authorized({
        permissions: [
            PermissionLevels.ADMIN,
            PermissionLevels.RECEPTIONIST
        ]
    })
    static async createPatient(req: Request, res: Response, next: NextFunction) {
        try {
            const newPat = req.body as PatientCreation;
            const patient = await PatientComponent.getInstance().createPatient(newPat);
            res.status(201).json(patient);
        } catch (err) {
            next(err);
        }
    }

    @Authorized({
        permissions: [
            PermissionLevels.ADMIN,
            PermissionLevels.DOCTOR,
            PermissionLevels.NURSE,
            PermissionLevels.RECEPTIONIST,
            PermissionLevels.VENDOR,
            PermissionLevels.ACCOUNTANT
        ]
    })
    static async searchPatients(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.query) {
                throw new ResourceError("Query not provided", ResourceErrorReason.INTERNAL_SERVER_ERROR);
            }
            const params = getSearchQuery(req);
            const { patients, count } = await PatientComponent.getInstance().searchPatients(params);

            res.json({patients, count});
        } catch (err) {
            next(err);
        }
    }

    @Authorized({
        permissions: [
            PermissionLevels.ADMIN,
            PermissionLevels.DOCTOR,
            PermissionLevels.NURSE,
            PermissionLevels.RECEPTIONIST,
            PermissionLevels.VENDOR,
            PermissionLevels.ACCOUNTANT
        ]
    })
    static async getPatients(req: Request, res: Response, next: NextFunction) {
        try {
            const patients = await PatientComponent.getInstance().getPatients();
            res.json(patients);
        } catch (err) {
            next(err);
        }
    }
}