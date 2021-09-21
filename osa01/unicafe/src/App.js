import React, { useState } from 'react'

const Header = ({header}) => {
  //console.log(header)
  return (    
    <h2>
      {header}
    </h2>    
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticsLine = ({name, value}) =>{
  return(
    <tr><td>{name}</td><td>{value}</td></tr>
  )
}

const Statistics = ({good,neutral,bad}) =>{
  if( (good+neutral+bad)===0 ){
    return (<div>no feedback given</div>)
  }  
  return(
    <table>
    <tbody>
    <StatisticsLine name="Good" value={good} />
    <StatisticsLine name="Neutral" value={neutral} />
    <StatisticsLine name="Bad" value={bad} />
    <StatisticsLine name="All" value={good+neutral+bad} />
    <StatisticsLine name="Average" value={(good-bad)/(good+bad+neutral) } />
    <StatisticsLine name="Positive" value={(good)/(good+bad+neutral)*100+' %'} />
    </tbody>
    </table>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1) 
  

  return (
    <div>
      <Header header="Give feedback" />
      <Button
        handleClick={increaseGood}
        text='Good'
      />
      <Button
        handleClick={increaseNeutral}
        text='Neutral'
      />
      <Button
        handleClick={increaseBad}
        text='Bad'
      />
      <Header header="Statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App
