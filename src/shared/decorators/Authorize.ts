import * as jwt from "jsonwebtoken";
import { NextFunction, Request } from "express";
import { getToken } from "../functions/GetToken";
import { ResourceError, ResourceErrorReason } from "../types/Errors";
import { Token } from "../types/Token";

export interface AuthParams {
    req?: Request;
    next?: NextFunction;
    permissions: string[];
}
export function Authorized(auth?: AuthParams) {
    return function (target: any, name: any, descriptor: any) {
        const original = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const request = args[0];
            const headers = args[0].headers;
            const next = args[0].next;

            try {
                if (!headers.authorization) {
                    throw new ResourceError("Not Authorized", ResourceErrorReason.INVALID_ACCESS);
                }
                const token = getToken(headers.authorization);
                if (token === null || token === undefined) {
                    throw new ResourceError('Not Authorized', ResourceErrorReason.INVALID_ACCESS);
                }
                const decoded = jwt.verify(token, process.env.SECRET) as Token
                // If no permissions are given, check to see if the user making the request
                // has the same id as in the request
                if (!auth && 
                    request.body.employeeid &&
                    decoded.employeeid !== request.body.employeeid) {
                    throw new ResourceError("Not Authorized To Perfom This Task", ResourceErrorReason.INVALID_ACCESS);
                }
                
                if (auth && !checkPermissions(auth.permissions, decoded, request)) {
                    throw new ResourceError("Not Authorized To Perform This Task", ResourceErrorReason.INVALID_ACCESS);
                }
                return original.apply(this, args);
            } catch (err) {
                if (err instanceof jwt.JsonWebTokenError){
                    next(new ResourceError('Not Authorized', ResourceErrorReason.INVALID_ACCESS));
                } else {
                    next(err);
                }

            }
        }

    }
}

function checkPermissions(perimssions: string[], token: Token, req?: Request) {
    let isAuthorized = false;
    perimssions.forEach((value) => {
        if (value === token.permission) isAuthorized = true;
    });
    return isAuthorized;
}