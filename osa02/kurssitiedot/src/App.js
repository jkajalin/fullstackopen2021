import React from 'react'


const MainHeader = ({mainheader}) => {
  
  return(  
  <h1>{mainheader}</h1>  
  )
  
}
const Header = ({coursename}) => {
  
  return(
  <>
  <h2>{coursename}</h2>
  </>
  )
  
}
const Part = ({part}) => {
  return(    
    <li> 
          {part.name} {part.exercises}
    </li>   
  )
  
}
const CourseContent = ({parts}) => {
    
  return(
    <>
    <ul>
      {parts.map(part => 
        <Part key={part.id} part={part} />
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
    <li> 
    <Header coursename={course.name} />
    <CourseContent parts={course.parts}/>
    <Total parts={course.parts}/> 
    </li>    
  )
}

const Courses = ({courses}) => {
  return(
    <ul>
    
      {courses.map(course => 
        <Course key={course.id} course={course} />
      )}
    
    </ul>
  )
}

const App = () => {

  const courses = [
    {
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
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      {/*
      <Header coursename={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/> 
      */}
      <MainHeader mainheader="Curriculum" />
      <Courses courses={courses}/>   
    </div>
    
  )
}

export default App
