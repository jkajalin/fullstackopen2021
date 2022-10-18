import React from "react";
import axios from "axios";
import { Patient } from "../../types";

import { useParams } from "react-router";
import { setPatientDetails, useStateValue } from "../../state";
import { apiBaseUrl } from "../../constants";

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import Man4Icon from '@mui/icons-material/Man4';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients}, dispatch] = useStateValue();  

  const patient = Object.values(patients).find( p => p.id === id);  
  
  console.log(patient?.name);
  
  if(id && !patient?.ssn){
    const getPatientDetails = async () => {
      try {
        const { data: patient } = await axios.get<Patient>( `${apiBaseUrl}/patients/${id}` );
        //dispatch({ type: "SET_PATIENT_DETAILS", payload: patient });
        dispatch( setPatientDetails(patient) );
      } catch (e) {
        console.error(e);
      }
    };
    console.log(`updating ${id}`);
    void getPatientDetails();
  }

  if(patient){
    return <div>
      <h2>{patient?.name}</h2>{patient.gender==="male"? <MaleIcon />: null}{patient.gender==="female"? <FemaleIcon />: null}{patient.gender==="other"? <Man4Icon />: null}
      <br />ssn: {patient.ssn}
      <br />occupation: {patient.occupation}
      
    </div>;
  }else{
    return <div>error</div>;
  }
  
};

export default PatientPage;