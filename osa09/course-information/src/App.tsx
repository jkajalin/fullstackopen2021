import { CoursePart } from "./types";

const App = () => {
  const courseName = "Half Stack application development";

  /**
 * Helper function for exhaustive type checking
 */
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  /*
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];
  */

  // this is the new coursePart variable
  const courseParts2: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is the easy course part",
      type: "normal"
    },
    {
      name: "Advanced",
      exerciseCount: 7,
      description: "This is the hard course part",
      type: "normal"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      type: "groupProject"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
      type: "submission"
    }
  ];

  const Header = ({ courseName }: { courseName: string }) => {
    return <h1> {courseName}</h1>;
  };

  const Content = ({ coursePrts }: { coursePrts: CoursePart[] }) => {
    /*
    const result = coursePrts.map(part =>
      <p key={part.name}>{part.name} {part.exerciseCount} </p>

    );
    */
    const result2 = coursePrts.map( part => {
      switch (part.type) {
        case "normal":
          return <div key={part.name}>
            
            <p>
              <strong >{part.name}</strong>
              <br />{part.description}
              <br />exerciseCount: {part.exerciseCount}
            </p>                      
          </div>
        case "groupProject":
          return <div key={part.name}>              
              <p>
                <strong >{part.name}</strong>
                <br />groupProjectCount: {part.groupProjectCount}
                <br />exerciseCount: {part.exerciseCount}
              </p>              
            </div>
        case "submission":
          return <div key={part.name}>                            
              <p>
                <strong >{part.name}</strong>
                <br />{part.description}
                <br />exerciseCount: {part.exerciseCount}
                <br />exerciseSubmissionLink: {part.exerciseSubmissionLink}
              </p>              
            </div>

        default:
          return <div>{assertNever(part)}</div>;
      }
      
    });

    return <div>{result2}</div>;
  };

  const Total = ({ coursePrts }: { coursePrts: CoursePart[] }) => {
    const result =
      <div>
        <h2>Total number of exercises{" "} {coursePrts.reduce((carry, part) => carry + part.exerciseCount, 0)}</h2>        
      </div>

    return <div>{result}</div>
  };


  return (
    <div>
      <Header courseName={courseName} />
      <Content coursePrts={courseParts2} />
      <Total coursePrts={courseParts2} />

    </div>
  );
};

export default App;
