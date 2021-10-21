import React, { useState } from 'react'

const Person = ({person}) =>{
  return(
    <li>{person.name} {person.phone}</li>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phone: '040-123456' },
    { name: 'Ada Lovelace', phone: '39-44-5323523' },
    { name: 'Dan Abramov', phone: '12-43-234345' },
    { name: 'Mary Poppendieck', phone: '39-23-6423122' }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newPhone, setNewPhone ] = useState('')
  const [ filterText, setFilterText ] = useState('')
  
  const [ personsFiltered, setPersonsFiltered] = useState(persons)  

  const addPerson =(event) =>{
    event.preventDefault()
    const personObject ={
      name: newName,
      phone: newPhone
    }    
    const nameExist= persons.find(person => person.name.toLowerCase() === personObject.name.toLowerCase())
    if( nameExist ){
      console.log("Exist!")
      window.alert(`${newName} is already added to phonebook`)
    }else{
      setPersons(persons.concat(personObject))
      setNewName('') 
      setNewPhone(' ')   
    }
      
    
  }
  const handleNameChange = (event) => {    
    setNewName(event.target.value)
  }
  const handleNewNumberChange = (event) => {
    setNewPhone(event.target.value)
  }

  

  const handleFilterChange = (event) => {
    setFilterText(event.target.value)    
    const filtered = persons.filter( persons => persons.name.toLowerCase().match(filterText.toLowerCase()) )
    //console.log(filtered)    
    if(event.target.value.length>0){     
      console.log('show filtered')      
      setPersonsFiltered( filtered )
    }else{      
      console.log('show persons')
      setPersonsFiltered( persons )
      
    }
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
          filter numbers: <input
            value={filterText}
            onChange={handleFilterChange}
            />
      </div>

      <h2>add New</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input
            value={newName}
            onChange={handleNameChange}
            />
        </div>
        <div>
          number: <input
            value={newPhone}
            onChange={handleNewNumberChange}
            />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personsFiltered.map(person => 
            <Person key={person.name} person={person}  />
        )}
      </ul>
      ...
      <div>debug: {newName}</div>
      <div>debug Phone: {newPhone}</div>
      <div>debug filer text: {filterText}</div>
    </div>
  )

}

export default App
