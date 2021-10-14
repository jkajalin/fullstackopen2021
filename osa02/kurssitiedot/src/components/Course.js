import React from 'react'
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

export {Course,Header,CourseContent,Total};