import { Button, Grid, InputLabel, MenuItem } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { DiagnosisSelection, FormikSelect, TextField } from "../../AddPatientModal/FormField";
import { useStateValue } from "../../state/state";
import { EntryWithoutId, HealthCardType, HealthCheckRating } from "../../types";
import { isValidDate } from "../../valitationUtils";

export type HealtCardOption = {
  value: HealthCardType;
  label: string;
};

export type HealthRatingOption= {
  value: HealthCheckRating;
  label: string;
};

const hCardOptions: HealtCardOption[] = [
  { value: HealthCardType.HealthCheck, label: "HealthCheck"},
  { value: HealthCardType.Hospital, label: "Hospital"},
  { value: HealthCardType.OccupationalHealthcare, label: "OccupationalHealthcare"},
];

const healthRatingOptions: HealthRatingOption[] = [
  { value: HealthCheckRating.Healthy, label: "Healthy"},
  { value: HealthCheckRating.LowRisk, label: "LowRisk"},
  { value: HealthCheckRating.HighRisk, label: "HighRisk"},
  { value: HealthCheckRating.CriticalRisk, label: "CriticalRisk"},
];



type typeSelectFieldProps = {
  name: string;
  label: string;
  options: HealtCardOption[];
};

export type healthRatingFieldProps = {
  name: string;
  label: string;
  options: HealthRatingOption[];
};

export type comSelectFieldProps = {
  name: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Array<any>;
};

export const TypeSelectField = ({ name, label, options }: typeSelectFieldProps) => (
  <>
    <InputLabel>{label}</InputLabel>
    <Field
      fullWidth
      style={{ marginBottom: "0.5em" }}
      label={label}
      component={FormikSelect}
      name={name}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label || option.value}
        </MenuItem>
      ))}
    </Field>
  </>
);

export const CommonSelectField = ({ name, label, options }: comSelectFieldProps) => (
  <>
    <InputLabel>{label}</InputLabel>
    <Field
      fullWidth
      style={{ marginBottom: "0.5em" }}
      label={label}
      component={FormikSelect}
      name={name}
    >
      {options.map((option) => (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        <MenuItem key={option.value} value={option.value}>
          {option.label || option.value}
        </MenuItem>
      ))}
    </Field>
  </>
);

export type dischargeFieldProps = {
  name: string;
  label: string;
};

export const DischargeField = () => {  

  return (
    <>
      <InputLabel>Discharge date</InputLabel>
      <Field
        fullWidth
        style={{ marginBottom: "0.5em" }}
        /*label={"Discharge date"}*/
        placeholder="YYYY-MM-DD"
        component={TextField}
        name="discharge.date"
      >      
      </Field>
      <InputLabel>Discharge criteria</InputLabel>
      <Field
        fullWidth
        style={{ marginBottom: "0.5em" }}
        /*label={"Discharge criteria"}*/
        placeholder="criteria"
        component={TextField}
        name="discharge.criteria"
      >      
      </Field>
    </>
  );
};

export const WorkHealhCareField = () => {
  
  return (
    <>
      <InputLabel>Employer name</InputLabel>
      <Field
        fullWidth
        style={{ marginBottom: "0.5em" }}
        /*label={"Discharge criteria"}*/
        placeholder="Acme"
        component={TextField}
        name="employerName"
      >      
      </Field>
      <InputLabel>SickLeave startDate</InputLabel>
      <Field
        fullWidth
        style={{ marginBottom: "0.5em" }}
        /*label={"Discharge date"}*/
        placeholder="YYYY-MM-DD"
        component={TextField}
        name="sickLeave.startDate"
      >      
      </Field>
      <InputLabel>SickLeave endDate</InputLabel>
      <Field
        fullWidth
        style={{ marginBottom: "0.5em" }}
        /*label={"Discharge date"}*/
        placeholder="YYYY-MM-DD"
        component={TextField}
        name="sickLeave.endDate"
      >      
      </Field>
      
    </>
  );
}; 

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
  onCancel: () => void;
}

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();
  const [ seltype, setSeltype ] = useState("HealthCheck");
  const [error, setError] = useState("");
  let initVal;
  const debug=false;
  
  if( seltype!==null && seltype==="HealthCheck"){
    initVal = {        
      description: "",
      date: "",
      specialist: "",
      diagnosisCodes: [""],
      type: "HealthCheck",
      healthCheckRating: 0,        
    }; 
  }
  if( seltype!==null && seltype==="Hospital"){ //purkka ei toimi, joten voisi poistaa
    initVal = {        
      description: "",
      date: "",
      specialist: "",
      diagnosisCodes: [""],
      type: "Hospital",
      discharge: { date: "", criteria: ""}  
    };
  }
  if( seltype!==null && seltype==="OccupationalHealthcare"){ //purkka ei toimi, joten voisi poistaa
    initVal = {        
      description: "",
      date: "",
      specialist: "",
      diagnosisCodes: [""],
      type: "OccupationalHealthcare",
      employerName: "",
      sicLeave: { startDate: "", endDate: ""}      
    };
  }
  //console.log( `Initial values `, initVal );
  return (
    <div>
      <>
      
      </>
    <Formik
      initialValues= { initVal as EntryWithoutId } 
      /*
      Koska iniVal purkka ei toimi voisi kirjoittaa vain yhden tapauksen initial values,
       bakend hoitaa oikeat arvot kohdalleen.
      Vaihtoehtoisesti voisi käyttää ennen palelimelle lähetystä validationUtils metodia toNewDetailsEntry(), onSubmit metodissa 
      */
      onSubmit={onSubmit}
      validate={values => {
        
        const requiredError = "Field is required";
        const dateError = 'Incorrect or missing date: ' + String(values.date);
        const errors: { [field: string]: string } = {};
        if (!values.type) {
          errors.type = requiredError;
        }else{
          setSeltype(values.type);
          if (values.type==="Hospital"){
            if(debug){
              console.log("Set type Hospital");
            }            
            if(!values.discharge){
              values.discharge={ date: "", criteria: "" };
            }
            values.discharge={ date: values.discharge.date, criteria: values.discharge.criteria };           
                        
          } 
          
        }        
        if (!values.description) {
          errors.name = requiredError;
        }
        if (!values.date) {
          errors.date= requiredError;
        }
        if( !isValidDate(values.date) ){
          errors.date= dateError;
        }
        if (!values.specialist) {
          errors.specialist= requiredError;
        }
        if (values.type==="Hospital"){
          if(debug){
            console.log("Hospital");
          }          
          //values.discharge={ date: "", criteria: "" };
          //values= { ...values, discharge: { date: "", criteria: "" } };
        }        
        if (values.type==="Hospital" && !values.discharge) {
          errors.discharge = requiredError; // not working
        }
        if (values.type==="Hospital" && !values.discharge.date) {          
          errors.discharge= requiredError; 
        }
        if( values.type==="Hospital" && !isValidDate(values.discharge.date) ){
          errors.discharge= "Discharge date incorrect:"+values.discharge.date; // does nothing good try
          if(debug){
            console.log(errors.discharge);
          }          
          setError("Discharge date incorrect:"+values.discharge.date);
          //setTimeout( () => setError(""), 5000 );
        }else{
          setError("");
        }
        if (values.type==="Hospital" && !values.discharge.criteria) {
          errors.discharge= requiredError;
        }
        
        

        return errors;
      }}      
    >
    {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {

      return (
        <div>
          {error!==undefined || error!==null ? <strong style={{ color: "red" }}>{error}</strong>: null}
          <>
          <TypeSelectField
              label="Type"
              name="type"
              options={hCardOptions}
            />
          </>
        <Form className="form ui">
          {/**
           * <TypeSelectField
              label="Type"
              name="type"
              options={hCardOptions}
            />
           * 
           */}
          
          { values.type? <>
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="specialist"
              name="specialist"
              component={TextField}
            />

            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
              name="diagnosisCodes"
            />


            {
              values.type === "HealthCheck" ?
                <CommonSelectField
                  label="Healt Rating"
                  name="healthCheckRating"
                  options={healthRatingOptions}
                />
                : null
            }
            {
              values.type === "Hospital" ?
                <DischargeField />
                : null
            }
            {
              values.type === "OccupationalHealthcare" ?
                <WorkHealhCareField />
                : null
            }
            {/*   
            <CommonSelectField
              label="Healt Rating"
              name="healthCheckRating"
              options={healthRatingOptions}
            /> 
          */}
            {/*   
            <Field
              label="Discharge"              
              name="discharge"
              component={DischargeField}
            />
          */}
            {/* // ... */}
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>

              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>

              </Grid>
            </Grid>
            <br /><br /><br />
            { debug? JSON.stringify(values) : null}
          </> : null }
          
        </Form>
        </div>        
      );
    }}
  </Formik>
  </div>
  );
};

export default AddEntryForm;