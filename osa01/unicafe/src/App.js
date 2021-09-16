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

const Statistics = ({name, value}) =>{
  return(
    <div>{name+' '+value}</div>
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
      <Statistics name="Good" value={good} />
      <Statistics name="Neutral" value={neutral} />
      <Statistics name="Bad" value={bad} />
      <Statistics name="All" value={good+neutral+bad} />

    </div>
  )
}

export default App
