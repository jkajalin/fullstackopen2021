import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
import cors from 'cors';

const app = express();

app.use(express.json());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('I know what you did last summer');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});