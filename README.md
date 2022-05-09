# Employee Patient Management System Service

## Table of Contents

* [How to start](#how-to-start)
* [Purpose of EPMS-Service](#purpose-of-epms-service)
* [Auth Module](#auth-module)
  * [Logging in](#post-authlogin)
  * [Changing password](#patch-authpassword)
  * [Is Authorized](#post-auth)
* [Employee Module](#employee-module)
  * [Creating a new employee](#post-employees)
  * [Update an employee](#patch-employeesid)
  * [Get an Employee](#get-employeesid)
  * [Get all Employees](#get-employees)
  * [Search Employees](#get-employeessearch)
* [Patient Module](#patient-module)
  * [Creating a new patient](#post-patients)
  * [Update a new patient](#patch-patientsid)
  * [Get an patient](#get-patientsid)
  * [Get all patients](#get-patients)
  * [Search patients](#get-patientssearch)
* [Error Responses](#error-responses)
* [Authorization](#authorization)


## How to Start
The service runs on localhost:3000. Ensure that Port 3000 is free and nothing else is running on it

Have Nodejs and NPM installed. Once installed pull the repo and run:
```sh
$ npm install
```
Once packages have been installed run:
```sh
$ npm run
```
You will need the environment variable DB_URI to connect to the database

## Purpose of EPMS-Service

EPMS-Service is the backend to the Employee Patient Management Service

Deployed Link: https://epms-service-api-q8l3e.ondigitalocean.app/

## Auth Module
The Auth module handles the following actions:
- Logging in
- Changing password

The routes:

| HTTP | Route | Description |
| ---- | ----- | ----------- |
| PATCH  | /auth/password | Change the password of a user |
| POST | /auth/login | Log a user of the system in |

### PATCH /auth/password
```
{
    employeeid: string,
    password: string,
    newpassword: string
}
```
In the request header, the Authorization header must be set with a bearer token given during login. The employeeid in the token must match the employeeid in the request

### POST /auth/login
```
{
    userid: string,
    password: string
}
```

Response on a successful login:
```
{
    token: string
}
```

### POST /auth
This route allows the client to see if a user currently using the system is authorized to perform an action.

*A Token must be provided in the `Authorization` Header*

Please refer to [Authorization](#authorization) to understand how to set up the header

The following is what should be sent in the request body:
```
{
    authorization: [
        'PERMISSION'
    ]
}
```
`Authorization` is an array of string values that can only be the following: `nurse`, `doctor`, `administrator`, `receptionist`, `vendor`

If you are using angular, you can create a Permissions.ts file and enter the following into the file:
```Typescript
export const PERMISSIONS = {
    ADMIN: 'administrator',
    NURSE: 'nurse',
    DOCTOR: 'doctor',
    VENDOR: 'vendor',
    RECEPTIONIST: 'receptionist'
}
```

You can put multiple of these permissions into one request. If one matches what permissions to the token, true is returned.

The following is what the response will look like:
```
{
    isAuthorized: boolean
}
```

## Employee Module
The Employee Module handles the following actions:
- Creating a new employee
- Update an employee
- Get an Employee
- Get all Employees
- Search Employees

| HTTP | Route | Description |
| ---- | ----- | ----------- |
| GET  | /employees | Get a list of all the employees |
| GET | /employess/search | Search for a specific employee |
| GET | /employees/:id | Get an employee by their id |
| POST | /employees | Create a new employee |
| PATCH | /employees/:id | Update an employee |

**Note: All these requests require a bearer token and administrator authorization**

### GET /employees
Get a list of all the employees. No request body needed. Authorization required
Response:
```
{
    employees: employee[]
}
```

### GET /employees/search
Get a list of employees based on a query. 

| Query Params | Description | Optional? |
| ------------ | ----------- | --------- | 
| employeeid   | The employee id of an employee | Yes |
| dateofbirth  | The date of birth of an employee | Yes |
| lastname | The last name or portion of  | Yes |
| page | The current page of the list | No |
| limit | The amount of employees to show. Default is 20 | Yes | 
| sort | Sort by last name. -1 Z-A; 1 A-Z; 0 is no sort | Yes |

Examples: 

* GET /employees/search?page=1&sort=1
* GET /employees/search?page=3&lastname=Mor&limit=5

Request body is not required for this route

```
{
    employees: [
        {
            employeeid: string,
            lastname: string,
            dateofbirth: date
        },
        ...
    ]
}
```

### GET /employees/:id
Get an employee by id

Response:
```
{
    employee: {
        employeeid: string,
        firstname: string,
        middleinitial: string,
        lastname: string,
        gender: string | null,
        dateofbirth: date,
        startdate: date,
        homephone: string | null,
        mobilephone: string | null,
        workphone: string | null,
        email: string,
        position: string,
        userid: string,
        streetname1: string | null,
        streetname2: string | null,
        zipcode: string | null,
        city: string | null,
        state: string | null,
        country: string | null
    }
}
```

### POST /employees
Create a new employee

Request: *Note: ? means an optional*
```
{
    userid: string,
    password: string,
    firstname: string,
    middleinitial?: string,
    lastname: string,
    dateofbirth: date,
    position: string,
    email: string,
    gender?: string,
    homephone?: string,
    mobilephone?: string,
    workphone?: string,
    streetname1?: string,
    streetname2?: string,
    zipcode?: string,
    city?: string,
    state?: string,
    country?: string
}
```

### PATCH /employees/:id
Update an Employee

Request:
```
{
    userid?: string,
    firstname?: string,
    middleinitial?: string,
    lastname?: string,
    dateofbirth?: date,
    position?: string,
    email?: string,
    gender?: string,
    homephone?: string,
    mobilephone?: string,
    workphone?: string,
    streetname1?: string,
    streetname2?: string,
    zipcode?: string,
    city?: string,
    state?: string,
    country?: string    
}
```

## Patient Module

The Patient Module handles the following actions:
- Creating a new patient
- Update a new patient
- Get an patient
- Get all patients
- Search patients

| HTTP | Route | Description |
| ---- | ----- | ----------- |
| GET  | /patients | Get a list of all the patients |
| GET | /patients/search | Search for a specific patient |
| GET | /patients/:id | Get a patient by their id |
| POST | /patients | Create a new patient |
| PATCH | /patients/:id | Update a patient |

**Note: All these requests require a bearer token and proper authorization**

### GET /patients
Get a list of all the patients. No request body needed. Authorization required
Response:
```
{
    patients: patient[]
}
```

### GET /patients/search
Get a list of patients based on a query. 

| Query Params | Description | Optional? |
| ------------ | ----------- | --------- | 
| patientid   | The patientid of an patient | Yes |
| dateofbirth  | The date of birth of an patient | Yes |
| lastname | The last name or portion of | Yes |
| page | The current page of the list | No |
| limit | The amount of employees to show. Default is 20 | Yes | 
| sort | Sort by last name. -1 Z-A; 1 A-Z; 0 is no sort | Yes |

Request body is not required for this route

Examples: 

* GET /patients/search?page=1&sort=1
* GET /patients/search?page=3&lastname=Mor&limit=5

Response:
```
{
    patients: [
        {
            patientid: string,
            lastname: string,
            dateofbirth: date
        },
        ...
    ]
}
```

### GET /patients/:id
Get a patient by id

Response:
```
{
    patientid: string,
    firstname: string,
    middleinitial: string | null
    lastname: string,
    gender: string | null,
    dateofbirth: date | null,
    outpatient: true,
    height: number | null,
    weight: number | null,
    homephone: string | null,
    mobilephone: string | null,
    workphone: string | null,
    email: string | null,
    streetname1: string | null,
    streetname2: string | null,
    zipcode: string | null,
    city: string | null,
    state: string | null,
    nok_firstname: string | null,
    nok_lastname: string | null,
    nok_mobilephone: string | null,
    insurance_companyname: string | null,
    insurance_memberid: string | null,
    insurance_groupnumber: string | null
}
```

### POST /patients
Create a patient

Request:
```
{
    firstname: string,
    lastname: string,
    dateofbirth: date,
    email: string,
    height?: number,
    weight?: number,
    middleinitial?: string,
    gender?: string,
    homephone?: string,
    mobilephone?: string,
    workphone?: string,
    streetname1?: string,
    streetname2?: string,
    zipcode?: string,
    city?: string,
    state?: string,
    country?: string,
    insurance_companyname?: string,
    insurance_memberid?: string,
    insurance_groupnumber?: string,
    nok_mobilephone?: string,
    nok_firstname?: string,
    nok_lastname?: string
}
```

### PATCH /patients/:id
Update a patient

Request:
```
{
    firstname?: string,
    middleinitial?: string,
    lastname?: string,
    dateofbirth?: date,
    height?: number,
    weight?: number,
    email?: string,
    gender?: string,
    homephone?: string,
    mobilephone?: string,
    workphone?: string,
    streetname1?: string,
    streetname2?: string,
    zipcode?: string,
    city?: string,
    state?: string,
    country?: string,
    insurance_companyname?: string,
    insurance_memberid?: string,
    insurance_groupnumber?: string,
    nok_mobilephone?: string,
    nok_firstname?: string,
    nok_lastname?: string
}
```

## Error Responses

Errors can occur for many different reasons.

The following is how the error response will be formatted:
```
{
    code: number,
    message: string
}
```

## Authorization

Authorization in EHRS will be done with [JWTs](https://jwt.io/) 

The decrypted token will have the following format:
```
{
    employeeid: string,
    permission: administrator | nurse | vendor | receptionist | doctor
    ...
}
```
Tokens will expire after 8 hours of creation.

When a successful login happens, a hashed token will be sent, this token can be used in the `Authorization` header of every request. All request require some form of authorization.

Your `Authorization` header should be formatted in the following way: `Authorization: Bearer {TOKEN}` 

If you are using Angular with the httpclient module for http request, use this code snippet for your authorization headers:

```Typescript
headers: HttpHeaders = new HttpHeaders();
function foo() {
    this.headers = this.headers.set('Authorization', `Bearer ${Token}`);
}
```
