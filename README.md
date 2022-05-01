# Employee Patient Management System Service

## Table of Contents

* Purpose of EPMS-Service
* Auth Module
* Employee Module
* Patient Module
* How to start

## Purpose of EPMS-Service

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
```json
{
    employeeid: string,
    password: string,
    newpassword: string
}
```
In the request header, the Authorization header must be set with a bearer token given during login. The employeeid in the token must match the employeeid in the request

### POST /auth/login
```json
{
    userid: string,
    password: string
}
```

Response on a successful login:
```json
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
    },
    token: string
}
```

## Employee Module
The Employee Module handles the following actions:
- Creating a new employee
- Update a new employee
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
```json
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
| page | The current page of the list | No |
| limit | The amount of employees to show. Default is 20 | No | 
| sort | Sort by last name. -1 Z-A; 1 A-Z; 0 is no sort | Yes |

Request body is not required for this route

```json
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
```json
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
```json
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
```json
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
- Get all patienta
- Search patienta

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
```json
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
| page | The current page of the list | No |
| limit | The amount of employees to show. Default is 20 | No | 
| sort | Sort by last name. -1 Z-A; 1 A-Z; 0 is no sort | Yes |

Request body is not required for this route

```json
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
```json
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
```json
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
```json
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

## How to Start
The service runs on localhost:3000. Ensure that Port 3000 is free and not else is running on it

Have Nodejs and NPM installed. Once installed pull the repo and run:
```sh
$ npm install
```
Once packages have been installed run:
```sh
$ npm run
```
You will need the environment variable DB_URI to connect to the database