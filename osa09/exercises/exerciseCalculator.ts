//const workweek = [3, 0, 2, 4.5, 0, 3, 1];

/*
interface eArgs {
  value1: number;
  value2: Array<number>;
}
*/

/*
const parseArgs = (args: Array<string>): eArgs => {
  if (args.length < 4) throw new Error('Not enough arguments');

  //console.log(`args: ${args}`);

  const workweek2 = args.filter((a, i) => {
    if (i > 2 && !isNaN(Number(a))) {
      return true;
    } else {
      return false;
    }
  });

  //console.log(workweek2);
  const ww = workweek2.map(a => Number(a));
  //console.log(`ww length:  ${ww.length}, args length ${args.length}`);

  if (!isNaN(Number(args[2])) && ww.length + 3 === args.length) {

    return {
      value1: Number(args[2]),
      value2: ww
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};
*/

interface resultWeekValues {
  periodLength: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (target: number, hours: Array<number>): resultWeekValues => {

  //const plenght = hours.length;
  const trainingdays = hours.filter(h => h !== 0).length;
  const totalHours = hours.reduce((h, sum) => sum + h, 0);
  //console.log(totalHours)

  let success = false;
  let rating = 1;
  let ratingDescription = 'not too bad but could be better';

  if ((totalHours / hours.length) > target) {
    success = true;
    rating = 3;
    ratingDescription = 'excelent';
  }
  if ((totalHours / hours.length) === target) {
    success = true;
    rating = 2;
    ratingDescription = 'good work';
  }

  const result = {
    periodLength: hours.length,
    trainingDays: trainingdays,
    average: totalHours / hours.length,
    target: target,
    success: success,
    rating: rating,
    ratingDescription: ratingDescription
  };

  return result;
};

/*
try {
  const { value1, value2 } = parseArgs(process.argv);
  console.log(calculateExercises(value1, value2));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
*/

//console.log( calculateExercises( 2, workweek ) )

export default calculateExercises;