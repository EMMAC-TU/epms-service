import { NextFunction, Request, Response } from "express";
import { ResourceErrorReason, ServiceErrorReason } from "../shared/types/Errors";

export function HttpErrorParser(
    err: any,
    req?: Request,
    res?: Response,
    next?: NextFunction
) {
    const status = {
        code: 500,
        message: err.message
    };
    console.log(status.message);
    switch(err.name) {
        case ResourceErrorReason.BAD_REQUEST:
            status.code = 400;
            break;
          case ResourceErrorReason.INVALID_ACCESS:
            status.code = 401;
            break;
          case ResourceErrorReason.FORBIDDEN:
            status.code = 403;
            break;
          case ResourceErrorReason.NOT_FOUND:
            status.code = 404;
            break;
          case ResourceErrorReason.TOO_MANY_REQUEST:
            status.code = 429;
            break;
          case ServiceErrorReason.INTERNAL:
            status.code = 500; 
            break;
      
          default:
            status.code = 500;
            status.message = "Internal Service Error";
    }
    res.status(status.code).json(status);
}