import * as jwt from 'jsonwebtoken';
import { IEmployee } from "../../../../shared/interfaces/IEmployee";

export function generateToken(user: IEmployee, expires?: number) {
    const expiration = expires ? expires : 28800;
    const payload = {
        employeeid: user.employeeid,
        permission: user.position
    };
    const options = {
        issuer: process.env.ISSUER,
        expiresIn: expiration
    }
    const token = jwt.sign(payload, process.env.SECRET, options);
    return token;
}