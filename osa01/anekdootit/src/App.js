import React, { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const ContentLine = ({text}) => (  
    <p>{text}</p>  
)


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))
  //console.log(points) 
  const [selected, setSelected] = useState(0)
  const [mostVoted, setMostvoted] = useState(0)
  //console.log(anecdotes.length)  
  
  const randomAnecdote = () => setSelected(Math.floor(Math.random() * (anecdotes.length-1) ) )

  
  const vote = () => {
    const pointsCopy = [...points]
    pointsCopy[selected] +=1
    setPoints([...pointsCopy])
    console.log(pointsCopy)
    for(let i=0; i< pointsCopy.length; i++)  {
          
      if( pointsCopy[i] > pointsCopy[mostVoted] ){ // Set new most voted value only if its bigger than previously most voted  
        console.log("Most votes on copy "+pointsCopy[i])
        setMostvoted(i)        
        console.log("count i= "+i)
        console.log("Most voted "+mostVoted)
      }
    }
    console.log("after for Most voted "+mostVoted) 
    //console.log(points)
    //countMostVoted()
  }
  
  return (
    <div>
      [0], {points[0]} pistettä.  {anecdotes[0]} <br />
      [1], {points[1]} pistettä.  {anecdotes[1]} <br /> 
      [2], {points[2]} pistettä.  {anecdotes[2]} <br /> 
      [3], {points[3]} pistettä.  {anecdotes[3]} <br /> 
      [4], {points[4]} pistettä.  {anecdotes[4]} <br /> 
      [5], {points[5]} pistettä.  {anecdotes[5]} <br /> 
      [6], {points[6]} pistettä.  {anecdotes[6]} <br /> 
      <h2>Anecdote of the day</h2>      
      <ContentLine text={anecdotes[selected]} />
      <br />
      <Button handleClick={vote} text="Vote anekdote" />
      <br />
      <br />
      <Button handleClick={randomAnecdote} text="Next Random anekdote" />
      <ContentLine text={points.join(',')} />
      <h2>Most voted</h2>      
      <ContentLine text={anecdotes[mostVoted]+" ["+mostVoted+"]" } />

      
    </div>
  )
}

export default App