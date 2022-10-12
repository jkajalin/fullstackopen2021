import patients from "../../data/patients";
import { LessSensitivePatient, NewPatientEntry, Patient } from "../types";
import { v1 as uuid } from 'uuid';

const getEntries = (): Patient[] =>{
  return patients;
};

const getLessSensitiveEntries = (): LessSensitivePatient[] => {
  return patients.map( ({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = ( entry: NewPatientEntry ) : Patient => {
  //const id = uuid();
  const newPatient = {    
    id: uuid(),
    ...entry
  };
  patients.push( newPatient );

  return newPatient;
};

export default { getEntries, getLessSensitiveEntries, addPatient };