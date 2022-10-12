import patientService from "../services/patientService";
import express from 'express';
import toNewPatientEntry from "../utils";

const router = express.Router();

router.get('/', (_req, res) =>{
  res.send( patientService.getLessSensitiveEntries() );
});

router.post('/', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //const newPatientEntry = req.body;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newPatient = patientService.addPatient(toNewPatientEntry(req.body));
    res.json(newPatient);
  } 
  catch ( error ) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);    
  }
});

export default router;