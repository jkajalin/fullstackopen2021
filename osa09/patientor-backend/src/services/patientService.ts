import patients from "../../data/patients";
import { Entry, EntryWithoutId, LessSensitivePatient, NewPatientEntry, Patient } from "../types";
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
    entries: new Array<Entry>,
    ...entry
  };
  patients.push( newPatient );

  return newPatient;
};

const addPatientDetailsEntry = ( id: string, entry: EntryWithoutId ) : Entry => {
  
  const patient = findById( id );
  const newEntry = {
    id: uuid(),
    ...entry
  };
  patient.entries.push(newEntry);

  return newEntry;
};

const findById = ( id: string ): Patient => {
  return patients.find( p => p.id === id) as Patient;
};

export default { getEntries, getLessSensitiveEntries, addPatient, findById, addPatientDetailsEntry };