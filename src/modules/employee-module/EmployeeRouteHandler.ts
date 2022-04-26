import { NextFunction, Request, Response, Router } from "express";
import { getSearchQuery } from "../../shared/functions/getSearchQuery";
import { Employee } from "../../shared/entity/Employee";
import { EmployeeCreation } from "../../shared/types/EmployeeCreation";
import { EmployeeComponent } from "./bloc/EmployeeComponent";
import { ResourceError } from "../../shared/types/Errors";
import { ResourceErrorReason } from "../../shared/types/Errors";
import { Authorized } from "../../shared/decorators/Authorize";
import { PermissionLevels } from "../../shared/types/PermissionLevels";

/**
 * 
 */
export class EmployeeRouteHandler {

    /**
     * 
     * @returns 
     */
    public static buildRouter() {
        const router = Router();

        router.get('/employees', this.getEmployees);
        router.get('/employees/search', this.searchEmployee);
        router.get('/employees/:id', this.getEmployee);
        router.post('/employees', this.createEmployee);
        router.patch('/employees/:id', this.updateEmployee);
        
        return router;
    }

    @Authorized({
        permissions: [ PermissionLevels.ADMIN ]
    })
    static async searchEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.query){
                throw new ResourceError("Query not provided", ResourceErrorReason.INTERNAL_SERVER_ERROR);
            }
            const params = getSearchQuery(req);
            const employees = await EmployeeComponent.getInstance().findEmployees(params);

            res.json({ employees });
        } catch (err) {
            next(err);
        }
    }

    @Authorized({
        permissions: [PermissionLevels.ADMIN]
    })
    static async updateEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id) {
                throw new ResourceError("Employee ID Required", ResourceErrorReason.BAD_REQUEST);
            }
            const employeeID = req.params.id;
            const employee = req.body as Partial<Employee>;
            await EmployeeComponent.getInstance().updateEmployee(employeeID,employee);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }

    @Authorized({
        permissions: [ PermissionLevels.ADMIN ]
    })
    static async getEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            if(!req.params.id) {
                throw new ResourceError("Employee ID Required", ResourceErrorReason.BAD_REQUEST);
            }
            const employeeId = req.params.id;
            const emp = await EmployeeComponent.getInstance().getEmployee(employeeId);

            res.json(emp).status(200);
        } catch (err) {
            next(err);
        }
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    @Authorized({
        permissions: [ PermissionLevels.ADMIN ]
    })
    static async getEmployees(req: Request, res: Response, next: NextFunction) {
        try {
            const emp = await EmployeeComponent.getInstance().getEmployees();
            res.json({ emp });
        } catch (err) {
            next(err);
        }
        
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
     @Authorized({
        permissions: [ PermissionLevels.ADMIN ]
    })
    static async createEmployee(req: Request, res: Response, next: NextFunction) {
        const newEmp = req.body as EmployeeCreation
        try{
            console.log("Creating Employee");
            const emp = await EmployeeComponent.getInstance().createEmployee(newEmp);
            res.json({...emp}).status(201)
        } catch (err){
            next(err);
        }
    }
}