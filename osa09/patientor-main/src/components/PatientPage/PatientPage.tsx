import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Diagnosis, Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, Patient } from "../../types";

import { useParams } from "react-router";
import { setPatientDetails, useStateValue } from "../../state";
import { apiBaseUrl } from "../../constants";

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import Man4Icon from '@mui/icons-material/Man4';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
let diagnosisList: Array<Diagnosis> ;


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
  dlist: Diagnosis[];
  dcodes: Array<Diagnosis['code']>;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PatientDiagnosisList = ( {dlist, dcodes} : DiagnosisProps  ) => {
  //dcodes.map(dc => <div key={dc}>{dlist.find( d => d.code === dc)}</div>);
  
  return <div> { dcodes.map( dc => <div key={ dc }>{dc} { dlist.find( d => d.code === dc)?.name }</div>) } </div>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HospitalEntryDetails = (e :HospitalEntry) => {

  return <div>{e.type}</div>;
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
    {/*e.diagnosisCodes*/}
    <br />    
    
    {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    (diagnosisList && e.diagnosisCodes!= undefined )? <div><PatientDiagnosisList dcodes={ e.diagnosisCodes as Array<Diagnosis['code']> } dlist={diagnosisList} /></div> : " no diagnosis list"
    }
    <br />Employer: {e.employerName}  
  </div>;
};



const EntriesDetails = ( {e} :EntryProps) => {
  /*
  const getDiagnosisList = async () => {
    if ( e && !diagnosisList ) {
      console.log("getting diagnoses");
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data: diagnosesList } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses/`);
        console.log(`updating`);
        diagnosisList = diagnosesList;
        console.log(diagnosisList[0]);
        //dispatch( setPatientDetails(patient) );

      } catch (e) {
        console.error(e);
      }
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void getDiagnosisList();
  */  

  switch (e.type) {
    case "Hospital":
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      return <div>{e.diagnosisCodes}</div>; // Jatka tästä

    case "HealthCheck":
      return <div>{e.diagnosisCodes}</div>;

    case "OccupationalHealthcare":      
      return <div><OccupationalHealthcareDetails e={e} /></div>; // Jatka tästä          
  
    default:            
      
      return <div></div>;
  }
  return <div></div>;
};

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients}, dispatch] = useStateValue();
  
  const getDiagnosisList = async () => {
    if ( !diagnosisList ) {
      console.log("getting diagnoses");
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data: diagnosesList } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses/`);
        console.log(`updating`);
        diagnosisList = diagnosesList;
        //console.log("debug "+diagnosisList[0].name);
        //dispatch( setPatientDetails(patient) );

      } catch (e) {
        console.error(e);
      }  
           
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void getDiagnosisList();

  const patient = Object.values(patients).find( p => p.id === id);  

  
  
  console.log(patient?.name);
  
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

  if(patient){
    return <div>
      <h2>{patient?.name}</h2>{patient.gender==="male"? <MaleIcon />: null}{patient.gender==="female"? <FemaleIcon />: null}{patient.gender==="other"? <Man4Icon />: null}
      <br />ssn: {patient.ssn}
      <br />occupation: {patient.occupation}
      <h3>Entries</h3>
      {/* <PatientEntriesList pat={patient} /> */}
      { patient.entries? 
        Object.values(patient.entries).map( (e : Entry) => <div key={e.date} >{e.date}
        <br /> Diagnosed by {e.specialist} 
        <br /> {e.description}
        <EntriesDetails e={e}/>        
        </div> )
        
        : null
      }     
      
    </div>;
  }else{
    return <div>error</div>;
  }
  
};

export default PatientPage;