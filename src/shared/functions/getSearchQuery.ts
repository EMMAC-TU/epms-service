import { Request } from "express";
import { SearchQuery } from "../types/SearchQuery";
import { isNullEmptyUndefined } from "./validator";

export function getSearchQuery(req: Request): SearchQuery{
    const params: SearchQuery = { page: 1, limit: 20, filter: {} };

    // Get Text Fields
    params.lastname = !isNullEmptyUndefined(req.query.lastname) ? req.query.lastname.toString() : "";
    params.dateofbirth = !isNullEmptyUndefined(req.query.dateofbirth) ? req.query.dateofbirth.toString() : "";
    params.employeeid = !isNullEmptyUndefined(req.query.employeeid) ? req.query.employeeid.toString() : "";
    params.patientid = !isNullEmptyUndefined(req.query.patientid) ? req.query.patientid.toString() : "";

    // Get Page
    if (req.query.page && Number.parseInt(req.query.page.toString()) !== NaN) {
        const val = Number.parseInt(req.query.page.toString());
        if (val > 0) {
            params.page = val;
        }
    }

    // Get limit
    if (req.query.limit && Number.parseInt(req.query.limit.toString()) !== NaN) {
        const val = Number.parseInt(req.query.limit.toString());
        if (val >= 1) {
            params.limit = val;
        }
    }
    
    // Get sort
    if (req.query.sort && Number.parseInt(req.query.sort.toString()) !== NaN) {
        const val = Number.parseInt(req.query.sort.toString());
        if (val === 1 || val === -1) {
            params.sort = val;
        }
    }

    // Get Filters
    if (req.query.filter) {
        if (req.query.filter instanceof Array) {
            req.query.filter.forEach(element => {
              matchFilter(element as string, params);
            });
        } else {
            matchFilter(req.query.filter as string, params);
        }

    }

    return params;
}

function matchFilter(element: string, params: any) {
    if (element === 'dateofbirth') params.filter.dateofbirth = true;
    if (element === 'lastname') params.filter.lastname = true;
    if (element === 'employeeid') params.filter.employeeid = true;  
    if (element === 'patientid') params.filter.patientid = true;  
}