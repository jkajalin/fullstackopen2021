import patients from "../../data/patients";
import { LessSensitivePatient, Patient } from "../types";

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

export default { getEntries, getLessSensitiveEntries };