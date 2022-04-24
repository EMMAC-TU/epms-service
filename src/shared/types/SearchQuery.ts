export type SearchQuery = {
    lastname?: string;
    employeeid?: string;
    patientid?: string;
    dateofbirth?: string;
    page: number;
    limit: number;
    sort?: 1 | -1;
    filter: {
        lastname?: boolean;
        employeeid?: boolean;
        patientid?: boolean;
        dateofbirth?: boolean;
    }
}