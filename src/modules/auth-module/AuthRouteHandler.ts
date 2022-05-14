import { NextFunction, Request, Response, Router } from "express";
import { Token } from "../../shared/types/Token";
import { Authorized } from "../../shared/decorators/Authorize";
import { ResourceErrorReason } from "../../shared/types/Errors";
import { ResourceError } from "../../shared/types/Errors";
import { AuthComponent } from "./bloc/AuthComponent";
import { PermissionLevels } from "../../shared/types/PermissionLevels";

/**
 * Route handler for the Authorization and Authentication Module
 */
export class AuthRouteHandler {
    public static buildRouter() {
        const router = Router();

        router.patch('/auth/password', this.changePassword);
        router.post('/auth/login', this.login);
        router.post('/auth', this.isAuthorized);
        return router;
    }

    @Authorized()
    static async isAuthorized(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.body.authorization) {
                throw new ResourceError('No Authorization Given', ResourceErrorReason.BAD_REQUEST);
            }
            const token = req.body.token as Token;
            const auths = req.body.authorization;
            const isAuthorized = AuthComponent.getInstance().isAuthorized(auths, token);

            res.status(200).json({isAuthorized});
        } catch (err) {
            next(err);
        }
    }

    @Authorized()
    static async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const curr_password = req.body.password;
            const new_password = req.body.newpassword;

            const token = req.body.token as Token;
            let employeeid =  "";
            let isAdminUpdatingPassword = false;
            // Handles an Admin changing the password of an employee
            if (req.body.employeeid) {
                if (token.permission === PermissionLevels.ADMIN) {
                    isAdminUpdatingPassword = true;
                    employeeid = req.body.employeeid;
                } else {
                    throw new ResourceError('Not Authorized to Update Employee Password', ResourceErrorReason.INVALID_ACCESS);
                }
            } else {
                employeeid = token.employeeid;
            }

            if (!new_password) {
                throw new ResourceError('New Password was not provided', ResourceErrorReason.BAD_REQUEST);
            }
            if (!isAdminUpdatingPassword && !curr_password) {
                throw new ResourceError('Password was not Provided', ResourceErrorReason.BAD_REQUEST);
            }

            if (!isAdminUpdatingPassword){
                const arePasswordsSame = await AuthComponent.getInstance().doPasswordsMatch(employeeid, curr_password);
                if (!arePasswordsSame) {
                    throw new ResourceError('Password is incorrect', ResourceErrorReason.BAD_REQUEST);
                }
            }
            await AuthComponent.getInstance().updatePassword(employeeid, new_password);
            res.status(200).json("Password Updated");
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

            const token = await AuthComponent.getInstance().login(req.body.userid, req.body.password);
            
            res.json({token});
        } catch (err) {
            next(err);
        }
    }
}