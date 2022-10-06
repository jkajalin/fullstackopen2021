import express from 'express';
import calculateBmi from './bmiCalculator';
const app = express();

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
  if (req.query.height && req.query.weight) {
    const bmi = calculateBmi(Number(req.query.height), Number(req.query.weight))
    //console.log(bmi)
    const returnObject = {
      ...req.query,
      bmi: bmi
    }
    //console.log(returnObject)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(returnObject))
  }else{
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: "malformatted parameters" }))
  }
  
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});