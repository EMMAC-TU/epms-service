import { Employee } from "../entity/Employee";
import { Patient } from "../entity/Patient";
import { SearchQuery } from "../types/SearchQuery";

const employeeReturns = {
    searchResults: "employeeid, dateofbirth, firstname, lastname",
    allInfo: "employeeid, firstname, middleinitial, lastname, gender, dateofbirth, \
    startdate, enddate, homephone, mobilephone, workphone, email, position, userid, \
    streetname1, streetname2, zipcode, city, state, country"
};

const patientReturns = {
    searchResults: "patientid, dateofbirth, firstname, lastname",
    allInfo: "patientid, creationdate, firstname, middleinitial, lastname, gender, dateofbirth, \
    outpatient, height, weight, homephone, mobilephone, workphone, email, \
    streetname1, streetname2, zipcode, city, state, country, \
    nok_firstname, nok_lastname, nok_mobilephone, insurance_companyname, insurance_memberid, insurance_groupnumber"
};

/**
 * Builds the login query
 * @param userid the id of a user
 * @returns the query for logging in
 */
export function buildLoginQuery(userid: string) {
    return { 
        text: `SELECT employeeid, position, password FROM employee WHERE userid=$1`,
        values: [userid.toLowerCase()]
    }
}

/**
 * Builds the get query
 * @param table The table to access
 * @param id The id of the patient or employee
 * @returns the query
 */
export function buildGetEntityQuery(table: 'patient' | 'employee', id?: string){
    let query = [
        `SELECT 
        ${table === 'employee' ? employeeReturns.allInfo : patientReturns.allInfo}
        FROM ${table}`
    ]
    const val : string[] = [];
    if (id){ 
        query.push(`WHERE ${table}id = $1`);    
        val.push(id);
    }
    return { text: query.join(' '), values: val };
}

/**
 * Builds the update entity query
 * @param table The table to access
 * @param id the id of the patient of employee
 * @param partialEnity the partial employee or patient
 * @returns the query
 */
export function buildUpdateEntityQuery(table: string, id: string, partialEnity: Partial<Employee> | Partial<Patient>): { text: string, values: any[] }{
    // Setup static beginning of query
    var query = [`UPDATE ${table}`];
    query.push('SET');

    // Create another array storing each set command
    // and assigning a number value for parameterized query
    var set:string[] = [];
    var vals: any[] = [];
    let count = 0;
    Object.entries(partialEnity).forEach((value) => {
        set.push(value[0] + ' = $' + (count + 1)); 
        vals.push(value[1]);
        count++;
    });
    query.push(set.join(', '));
    count++;
    // Add the WHERE statement to look up by id
    query.push(`WHERE ${table}id = $` + count );
    vals.push(id);

    // Return a complete query string
    return { text: query.join(' '), values: vals}
     
}

/**
 * Builds the create entity query
 * @param entity The entity to create
 * @returns the query
 */
export function buildCreateQuery(entity?: Employee | Patient): { text: string, values: string[] } {
    let table = "";
    if (entity instanceof Employee) table = 'employee';
    if (entity instanceof Patient) table = 'patient';

    var query = [`INSERT INTO ${table}(`]

    var keys: string[] = []; // Holds the keys
    var placeholders: string[] = []; // Holds the placeholders $1...
    var vals: string[] = []; // Holds the values that the values will replace the placeholders

    Object.entries(entity).forEach((value, index) =>{
        keys.push(value[0]);
        placeholders.push(`$${index+1}`);
        vals.push(value[1]);
    });

    query.push(keys.join(','));
    query.push(') VALUES('); // Close the keys list
    query.push(placeholders.join(','));
    query.push(')');

    const queryobj = {
        text: query.join(' '),
        values: vals
    }
    return queryobj
}

/**
 * Builds the search query
 * @param query the search query
 * @param table the table to access
 * @returns two queries, one for the search, one for the count
 */
export function buildSearchQuery(query: SearchQuery, table: 'employee' | 'patient'): {
    searchQuery: { text: string, values: string[] },
    countQuery: { text: string, values: string[] }
}{
    
    let buildquery = [
        `SELECT 
        ${table === 'employee' ? employeeReturns.searchResults : patientReturns.searchResults} 
        FROM ${table}`,
        'WHERE'
    ];

    let buildCount = [
        `SELECT count(*) FROM ${table}`,
        'WHERE'
    ]

    let index = 1;
    const whereClauses: string[] = [];
    const vals: any[] = []; 
    const countVals: any[] = []; 

    if (query.patientid) {
        whereClauses.push(`patientid=$${index}`);
        vals.push(query.patientid);
        countVals.push(query.patientid);

        index ++;
    }
    if (query.employeeid) {
        whereClauses.push(`employeeid=$${index}`);
        vals.push(query.employeeid);
        countVals.push(query.employeeid);

        index ++;
    }
    if (query.dateofbirth) {
        whereClauses.push(`dateofbirth=$${index}`);
        vals.push(query.dateofbirth);
        countVals.push(query.dateofbirth);

        index ++;
    }
    if (query.lastname) {
        whereClauses.push(`LOWER(lastname) LIKE LOWER($${index})`);
        vals.push(query.lastname+'%');
        countVals.push(query.lastname+'%');

        index ++;
    }
    if (whereClauses.length === 0){
        buildquery.pop();
        buildCount.pop();
    } 


    buildquery.push(whereClauses.join(' or '));
    buildCount.push(whereClauses.join(' or '));

    // Add Sort
    if (query.sort && query.sort === -1) buildquery.push('ORDER BY lastname DESC');
    if (query.sort && query.sort === 1) buildquery.push('ORDER BY lastname ASC');

    // Add limit
    buildquery.push(`limit $${index}`);
    index ++;
    vals.push(query.limit);

    // Add offset --> Page starts at one but offset needs to be 0 to start
    buildquery.push(`OFFSET ${query.limit*(query.page-1)}`); 

    const searchQuery = {
        text: buildquery.join(' '),
        values: vals
    }

    const countQuery = {
        text: buildCount.join(' '),
        values: countVals
    }

    console.log(countQuery)
    return { searchQuery, countQuery };
}

/**
 * Builds Does Field Exists query
 * @param table The table to access
 * @param query the query
 * @returns A query
 */
export function buildDoesFieldExistQuery(table: 'employee' | 'patient', query: {
    field: 'employeeid' | 'patientid' | 'userid' | 'email',
    value: string
}) {
    let buildquery = ['SELECT'];

    if (query.field === "employeeid") buildquery.push('employeeid');
    if (query.field === "patientid") buildquery.push('patientid');
    if (query.field === "userid") buildquery.push('userid');
    if (query.field === "email") buildquery.push('email');

    buildquery.push(`FROM ${table}`);
    buildquery.push('WHERE');
    buildquery.push(`${query.field}=$1`);
    return { text: buildquery.join(' '), values: [query.value.toLowerCase()]} ;
}

/**
 * Builds the get password query
 * @param employeeid The employee id
 * @returns Password query
 */
export function buildPasswordQuery(employeeid: string): { text: string, values: string[] } {
    return { text: 'SELECT password FROM employee WHERE employeeid=$1', values: [employeeid] }
}

/**
 * Builds the update password query
 * @param employeeid The employee id
 * @param password The password
 * @returns The password query
 */
export function buildUpdatePasswordQuery(employeeid: string, password: string): { text: string, values: string[] }{
    return {
        text: `UPDATE employee
                SET password=$1
                WHERE employeeid=$2`,
        values: [password, employeeid]
    };
}
