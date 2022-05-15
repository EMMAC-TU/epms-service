import { Employee } from "../entity/Employee";
import { Patient } from "../entity/Patient";
import { EmployeeCreation } from "../types/EmployeeCreation";
import { ResourceError, ResourceErrorReason } from "../types/Errors";
import { PatientCreation } from "../types/PatientCreation";

export function isNullEmptyUndefined(value: any){ 
    return (!value || value === null || value === undefined || value.length < 1)
}

/**
 * Checks if a user password passes the password constraints we have for the product
 * These are: one lowercase and upper case letter, one digit, one special character,
 * at least 8 characters
 * 
 * Throws a 400 if the password does not meet any one of these contraints
 * 
 * @param password The password to validate
 */
export function validatePasswordCriteria(password: string) {
    const letterRegex = password.match(/[a-z]/g);
    const capitalLetterRegex = password.match(/[A-Z]/g);
    const numberRegex = password.match(/[0-9]+/g);
    const symbolRegex = password.match(/[@.,#$=%&-/:-?{-~!"^_`\[\]\(\)\*\+\\]/g); // Covers: ~ ` ! @ # $ % ^ & * ( ) _ - + = { } [ ] | \ : ; ' < , > . ? /

    if (!letterRegex || !capitalLetterRegex || !numberRegex || !symbolRegex || password?.length < 8) {
      throw new ResourceError(`Password is not valid`, ResourceErrorReason.BAD_REQUEST);
    }
}

 /**
   * @before string is checked by stringCheck
   * @param email is the string input from user
   * @return boolean if email is valid format
   * @format of email includes @ and .  
   */
export function validateEmailCriteria(email: string): void{
    if(!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)?.length){
      throw new ResourceError("Email is not valid", ResourceErrorReason.BAD_REQUEST);
    } 
}

/**
 * Validate the phonenumbers of an entity
 * @param entity The entity to check
 */
export function validatePhoneNumbers(entity: EmployeeCreation | PatientCreation) {
  if(entity.homephone && !entity.homephone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)){
    throw new ResourceError("Home phone number is not formatted correctly", ResourceErrorReason.BAD_REQUEST);
  }
  if(entity.mobilephone && !entity.mobilephone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)){
      throw new ResourceError("Mobile phone number is not formatted correctly", ResourceErrorReason.BAD_REQUEST);
  }
  if(entity.workphone && !entity.workphone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)){
      throw new ResourceError("Work phone number is not formatted correctly", ResourceErrorReason.BAD_REQUEST);
  }
}

/**
 * Validates an UUID
 * @param id The id to match
 * @returns True if it matches, false otherwise
 */
export function isValidUUID(id: string) {
  return id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
}

/**
 * Verify update fields
 * @param entity 
 */
export function verifyUpdateFields(entity: Partial<Employee> | Partial<Patient> , cantUpdateFields: string[]) {
  Object.keys(entity).forEach((key, i) => {
      if (cantUpdateFields.includes(key)){
          throw new ResourceError(`Cannot update ${key}`, ResourceErrorReason.FORBIDDEN);
      }
  });
}

/**
 * Removes undefined and null fields
 * @param entity 
 * @returns a new object with no undefined or null fields
 */
export function validateUndefinedNullFields(entity: EmployeeCreation | PatientCreation) {
  let obj: any = {};
  Object.entries(entity).forEach((val) => {
    if (val[1] !== '' || val[1] !== undefined || val[1] !== null) {
      obj[val[0]] = val[1];
    }
  });
  
  return obj;
}

/**
 * Validates the gender
 * @param entity 
 * @returns 
 */
export function validateGender(entity: EmployeeCreation | PatientCreation | Employee | Patient) {
  if (!entity.gender) return;
  switch (entity.gender.toLowerCase()) {
    case 'female':
      entity.gender = 'F';
      break;
    case 'male':
      entity.gender = 'M';
      break;
    case 'other':
      entity.gender = 'O';
      break;
    case 'f':
      entity.gender = 'F';
      break;
    case 'm':
      entity.gender = 'M';
      break;
    case 'o':
      entity.gender = 'O';
      break;
    default:
      throw new ResourceError(`${entity.gender} is not a valid gender`, ResourceErrorReason.BAD_REQUEST);
  }
}
