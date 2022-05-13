export type EmployeeCreation = {
    userid: string;
    password: string;
    firstname: string;
    middleinitial?: string;
    lastname: string;
    gender: string;
    dateofbirth: Date | string;
    email?: string;
    position: string;
    streetname1?: string,
    city?: string,
    state?: string,
    zipcode?: string,
    country?: string
    streetname2?: string,
    homephone?: string;
    mobilephone?: string;
    workphone?: string;
}