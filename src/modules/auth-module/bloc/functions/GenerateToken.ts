import * as jwt from 'jsonwebtoken';
import { IEmployee } from "../../../../shared/interfaces/IEmployee";

export function generateToken(user: IEmployee, expires?: number) {
    const expiration = expires ? expires : 1800;
    const payload = {
        employeeid: user.employeeid,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        permission: user.position
    };
    const options = {
        issuer: process.env.ISSUER,
        expiresIn: expiration
    }
    console.log("Signing Token");
    const token = jwt.sign(payload, process.env.SECRET, options);
    return token;
}