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
    if(!email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi)?.length){
      throw new ResourceError("Email is not valid", ResourceErrorReason.BAD_REQUEST);
    } 
}

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
 * 
 * @param entity 
 */
export function verifyUpdateFields(entity: Partial<Employee> | Partial<Patient> , cantUpdateFields: string[]) {
  Object.keys(entity).forEach((key, i) => {
      if (cantUpdateFields.includes(key)){
          throw new ResourceError(`Cannot update ${key}`, ResourceErrorReason.FORBIDDEN);
      }
  });
}

export function validateUndefinedNullFields(entity: EmployeeCreation | PatientCreation) {
  let obj: any = {};
  Object.entries(entity).forEach((val) => {
    if (val[1] !== '' || val[1] !== undefined || val[1] !== null) {
      obj[val[0]] = val[1];
    }
  });
  
  return obj;
}
