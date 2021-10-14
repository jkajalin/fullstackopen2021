import React from 'react'



const Header = ({coursename}) => {
  
  return(
  <>
  <h1>{coursename}</h1>
  </>
  )
  
}
const Part = ({part}) => {
  return(    
    <li key={part.id}>
          {part.name} {part.exercises}
    </li>   
  )
  
}
const CourseContent = ({parts}) => {
    
  return(
    <>
    <ul>
      {parts.map(part => 
        <Part part={part} />
      )}
    </ul>
    </>
  )
}
const Total = ({parts}) => {
  
  var totalAmount = parts.reduce(
    function(sum, parts){
      return sum + parts.exercises
  },0)

  return(
    <>
     <p>{"Total of "+totalAmount+" exercises"}</p>
    </>
  )
}
const Course = ({course}) => {
  //console.log(course)
  return(
    <>
    <Header coursename={course.name} />
    <CourseContent parts={course.parts}/>
    <Total parts={course.parts}/> 
    </>    
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      {/*
      <Header coursename={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/> 
      */}
      <Course course={course}/>   
    </div>
    
  )
}

export default App
