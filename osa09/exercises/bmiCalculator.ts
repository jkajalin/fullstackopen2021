interface BmiArgs {
  value1: number;
  value2: number;
}

const parseArguments = (args: Array<string>): BmiArgs => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

const calculateBmi = ( height: number, weight: number ): string => {
  const bmi = weight / ( height * height ) *10000  ;
  //console.log(`BMI: ${bmi}`)  
  if( bmi < 24.9 ){
    return "Normal (healthy weight)";
  }
  if( bmi >= 25 && bmi <= 29.9 ){
    return "Overweight";
  }
  if( bmi >= 30){
    return "Obese";
  }
  return "missing or undefined args?"
}

if( process.argv.length === 4 ){
  try {
    const { value1, value2 } = parseArguments(process.argv);
    console.log(calculateBmi( value1, value2 ));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.'
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}



//console.log(calculateBmi(180, 74))
export default calculateBmi
