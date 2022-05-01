import { NextFunction, Request, Response, Router } from "express";
import { Authorized } from "../../shared/decorators/Authorize";
import { ResourceErrorReason } from "../../shared/types/Errors";
import { ResourceError } from "../../shared/types/Errors";
import { AuthComponent } from "./bloc/AuthComponent";

export class AuthRouteHandler {
    public static buildRouter() {
        const router = Router();

        router.patch('/auth/password', this.changePassword);
        router.post('/auth/login', this.login);

        return router;
    }

    @Authorized()
    static async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const curr_password = req.body.password;
            const employeeid = req.body.employeeid;
            const new_password = req.body.newpassword;

            if (!new_password) {
                throw new ResourceError('New Password was not provided', ResourceErrorReason.BAD_REQUEST);
            }
            if (!curr_password) {
                throw new ResourceError('Password was not Provided', ResourceErrorReason.BAD_REQUEST);
            }
            if (!employeeid) {
                throw new ResourceError('Employeeid was not provided', ResourceErrorReason.BAD_REQUEST);
            }

            const arePasswordsSame = await AuthComponent.getInstance().doPasswordsMatch(employeeid, curr_password);
            if (!arePasswordsSame) {
                throw new ResourceError('Passwords do not match', ResourceErrorReason.BAD_REQUEST);
            }
            await AuthComponent.getInstance().updatePassword(employeeid, new_password);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.body.userid) {
                throw new ResourceError("Username not provided", ResourceErrorReason.BAD_REQUEST);
            }
            if (!req.body.password) {
                throw new ResourceError("Password not provided", ResourceErrorReason.BAD_REQUEST);
            }

            const user = await AuthComponent.getInstance().login(req.body.userid, req.body.password);
            
            res.json(user);
        } catch (err) {
            next(err);
        }
    }
}