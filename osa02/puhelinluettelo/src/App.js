import React, { useState } from 'react'

const Person = ({person}) =>{
  return(
    <li>{person.name}</li>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [ newName, setNewName ] = useState('')

  

  const addPerson =(event) =>{
    event.preventDefault()
    const personObject ={
      name: newName
      
    }    
    const nameExist= persons.find(person => person.name === personObject.name)
    if( nameExist ){
      console.log("Exist!")
      window.alert(`${newName} is already added to phonebook`)
    }else{
      setPersons(persons.concat(personObject))
      setNewName('') 
         
    }
      
    
  }
  const handleNameChange = (event) => {
    //const nameExist= persons.find(person => person.name === event.target.value)
    //console.log(nameExist.name)
    //console.log(nameExist)
    /*
    if(nameExist){
      console.log("Exist!")
      window.alert(`${newName} is already added to phonebook`)
    }else{
      
      
    }*/
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input
            value={newName}
            onChange={handleNameChange}
            />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person => 
            <Person key={person.name} person={person}  />
        )}
      </ul>
      ...
      <div>debug: {newName}</div>
    </div>
  )

}

export default App
