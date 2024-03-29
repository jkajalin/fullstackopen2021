import React from "react";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Diagnosis, Entry, EntryWithoutId, HealthCheckEntry, HealthCheckRating, HospitalEntry, OccupationalHealthcareEntry, Patient } from "../../types";

import { useParams } from "react-router";
import { setPatientDetails, useStateValue } from "../../state";
import { apiBaseUrl } from "../../constants";

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import Man4Icon from '@mui/icons-material/Man4';
import AddEntryForm from "./AddEntryDetails";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
//let diagnosisList: Array<Diagnosis> ;

/*
const PatientEntriesList = ( pat: Patient ) => {
  let result;
  
  if(pat.entries){
    
    result = Object.values(pat.entries).map( (e : Entry) => <div key={e.date} >${e.date} ${e.description}</div> );
  }

  return <div>{result}</div>;
};
*/

/**
 * Helper function for exhaustive type checking
 */
/*
 const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
*/



// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DiagnosisProps{
  //dlist: Diagnosis[];
  dcodes: Array<Diagnosis['code']>;
}
// Lis diagnosis codes in entry
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PatientDiagnosisList = ( {dcodes} : DiagnosisProps  ) => {
  const [{ diagnoses }] = useStateValue();
  //dcodes.map(dc => <div key={dc}>{dlist.find( d => d.code === dc)}</div>);
  
  return <div> { dcodes.map( dc => <div key={ dc }>{dc} { Object.values(diagnoses).find( d => d.code === dc)?.name }</div> ) } </div>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HospitalEntryDetails = ( {e} :HospitalEntryProps) => {

  return <div>
    { 
      e.discharge? <div>Discharge {e.discharge.date} {e.discharge.criteria}</div>  : null
    }
  </div>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HealthCheckDetails = (e :HealthCheckEntry) => {

  return <div>{e.type}</div>;
};


interface EntryProps{
  e: Entry;
}
interface OccupationalHealthcareProps{
  e: OccupationalHealthcareEntry;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface HospitalEntryProps{
  e: HospitalEntry;
}

const OccupationalHealthcareDetails  = ( {e} :OccupationalHealthcareProps ) => {

  return <div> 
    Employer: {e.employerName}
    <br />
    {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    ( e.diagnosisCodes!= undefined )? <div><PatientDiagnosisList dcodes={ e.diagnosisCodes as Array<Diagnosis['code']> } /></div> : null
    }
    {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    ( e.sickLeave!= undefined )? <div><h4>Sick leave:</h4>
      start date: {e.sickLeave.startDate}
      <br />end date: {e.sickLeave.endDate}
      </div> : null
    }
      
  </div>;
};


const EntriesDetails = ( {e} :EntryProps) => {
 
  switch (e.type) {
    case "Hospital":
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      return <div>
        
        {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          ( e.diagnosisCodes!= undefined )? <div><PatientDiagnosisList dcodes={ e.diagnosisCodes as Array<Diagnosis['code']> } /></div> : null
        }
        <div><HospitalEntryDetails e={e}/></div>
      </div>; // Jatka tästä

    case "HealthCheck":
      return <div>
        {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          ( e.diagnosisCodes!= undefined )? <div><PatientDiagnosisList dcodes={ e.diagnosisCodes as Array<Diagnosis['code']> } /></div> : null
        }       
        Health check rating: {
        e.healthCheckRating
        }
      </div>;

    case "OccupationalHealthcare":      
      return <div><OccupationalHealthcareDetails e={e} /></div>;       
  
    default:            
      
      return <div></div>;
  }
  return <div></div>;
};

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [ { patients }, dispatch] = useStateValue();

  const [error, setError] = React.useState<string>();
  
   const patient = Object.values(patients).find( p => p.id === id);    
  
  //console.log(patient?.name);

  
  
  if(id && !patient?.ssn){
    const getPatientDetails = async () => {
      try {
        const { data: patient } = await axios.get<Patient>( `${apiBaseUrl}/patients/${id}` );
        
        dispatch( setPatientDetails(patient) );
      } catch (e) {
        console.error(e);
      }
    };
    console.log(`updating ${id}`);
    void getPatientDetails();
  }

  const submitNewEntry= async (values: EntryWithoutId) => {
    
    //let entryvalues;
    try {
      if(id && patient){
        
        const { data: newEntry } = await axios.post<Entry>(
          `${apiBaseUrl}/patients/${id}/entries`,
          values
        );
        console.log(newEntry);
        if(!patient.entries){
          //console.log("creating entries array");
          //patient.entries= [newEntry];
          patient.entries= new Array(newEntry);
        }else{
          patient.entries.push( newEntry );
        }        
        dispatch({ type: "SET_PATIENT_DETAILS", payload: patient });
        
      }
      
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(String(e?.response?.data) || "Unrecognized axios error");
        setTimeout( () => setError(undefined), 5000 );
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
        setTimeout( () => setError(undefined), 5000 );
      }
    }
  };

  if(patient){
    return <div>
      <h2>{patient?.name}</h2>{patient.gender==="male"? <MaleIcon />: null}{patient.gender==="female"? <FemaleIcon />: null}{patient.gender==="other"? <Man4Icon />: null}
      <br />ssn: {patient.ssn}
      <br />occupation: {patient.occupation}
      <h3>Entries</h3>
      {/* <PatientEntriesList pat={patient} /> */}
      { patient.entries? 
        Object.values(patient.entries).map( (e : Entry) => <div key={e.date} >
        <br /><strong>{e.date}</strong>
        <br /> Type: {e.type}
        <br /> Diagnosed by {e.specialist} 
        <br /> {e.description}
        <EntriesDetails e={e}/>        
        </div> )
        
        : null
      }     
      {error!==undefined || error!==null ? <strong style={{ color: "red" }}>{error}</strong>: null}
      <div>
        <h3>Add new entry</h3>
        <AddEntryForm onSubmit={submitNewEntry} onCancel={ () => { setError(undefined); } } />

      </div>
    </div>;
  }else{
    return <div>error</div>;
  }
  
};

export default PatientPage;