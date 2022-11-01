import { Discharge, EntryWithoutId, Gender, HealthCardType, HealthCheckRating, NewPatientEntry } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn|| !isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }
  return ssn;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
      throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCardType = ( param: any ): param is HealthCardType => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCardType).includes(param);
};

export const parseHealthCardType = ( htype: unknown ): HealthCardType => {
  if( !htype || !isHealthCardType(htype) ){
    throw new Error('Incorrect or missing HealthCardType: ' + htype);
  }
  return htype;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }

  return occupation;
};

const parseDescription = ( description: unknown ): string =>{
  if( !description || !isString(description) ){
    throw new Error('Incorrect or missing description');
  }
  return description;
};

const parseSpecialist = ( specialist: unknown ): string =>{
  if( !specialist || !isString( specialist ) ){
    throw new Error('Incorrect or missing specialist');
  }
  return specialist;
};

/*
const parseDiagnosisCodes = ( diagnosiscodes: unknown ): Array<Diagnosis['code']> => {
  if( !diagnosiscodes || !(diagnosiscodes instanceof  Array<Diagnosis['code']>) ){
    throw new Error('Incorrect or missing diagnosiscodes');
  }
  return diagnosiscodes;
};
*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewPatientEntry = ( object: any ): NewPatientEntry => {
  const newEntry: NewPatientEntry = {
    name: parseName(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseSsn(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
    //entries: new Array<Entry>
  };

  return newEntry;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDischarge = ( discharge: any ): boolean => {
  
  if( !discharge || !parseDate(discharge.date) || !isString(discharge.criteria) ){
    return false;
  } 
  return true;
};

const parseDischarge = ( discharge: unknown ): Discharge => {
  if( !discharge || !isDischarge(discharge)  ){
    throw new Error('Incorrect or missing discharge');
  }
  return discharge as Discharge;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = ( rating: unknown ): HealthCheckRating => {
  if( !rating || !isHealthCheckRating ){
    throw new Error('Incorrect or missing HealthCheckRating');
  }
  return rating as HealthCheckRating;
};

const parseEmployerName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing employerName');
  }
  return name;
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewDetailsEntry = ( object: any ): EntryWithoutId => {
  
  const otype = parseHealthCardType( object.type );

  switch( otype ){

    case "Hospital":
      return {
        description: parseDescription( object.description ),
        date: parseDate( object.date ),
        specialist: parseSpecialist( object.specialist ),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        diagnosisCodes: object.diagnosisCodes,
        type: otype,
        discharge: parseDischarge(object.discharge),
    
      } as EntryWithoutId;
    
    case "OccupationalHealthcare":
      return {
        description: parseDescription( object.description ),
        date: parseDate( object.date ),
        specialist: parseSpecialist( object.specialist ),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        diagnosisCodes: object.diagnosisCodes,
        type: otype,
        employerName: parseEmployerName(object.employerName),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        sickLeave: object.sickLeave,
      } as EntryWithoutId;
      
    default:
      return {
        description: parseDescription( object.description ),
        date: parseDate( object.date ),
        specialist: parseSpecialist( object.specialist ),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        diagnosisCodes: object.diagnosisCodes,
        type: otype,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
    
      } as EntryWithoutId;
  } 
  
};


export default toNewPatientEntry;