import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  //res.send('bmi');
  //console.log(req.query)
  //const qObject = req.query  
  //console.log(qObject.height)
  //console.log(req.query.height)
  //console.log(req.query.weight)
  if ( !isNaN(Number(req.query.height))  && !isNaN(Number(req.query.weight)) ) {

    const bmi = calculateBmi(Number(req.query.height), Number(req.query.weight));
    //console.log(bmi)
    const returnObject = {
      ...req.query,
      bmi: bmi
    };
    //console.log(returnObject)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(returnObject));
  }else{
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "malformatted parameters" }));
  }
  
});

app.post('/exercises', (req, res) => {
  //res.send('exercises');
  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  
  //console.log(daily_exercises);
  //console.log(target);  
  
  if( !daily_exercises || !target) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "parameters missing" }));
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  if ( daily_exercises instanceof Array<number> && !isNaN(Number(target)) ) {
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const rObject = calculateExercises(Number(target), daily_exercises );
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rObject));
  }  
  else{
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "malformatted parameters" }));
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});