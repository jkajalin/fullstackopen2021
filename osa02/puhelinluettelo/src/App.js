import React, { useState, useEffect } from 'react'
import personService from './services/personsDbCom'

// Palauttaa yksittäisen Person "olion" poistavan napin, id suoraan handlerille
const DelPersonBtn = ({handler}) => {

  return(
    <button onClick={handler}>'delete'</button>
  )
}

const Person = ({person, delHandler}) =>{
  return(
    <li>{person.name} {person.phone} <DelPersonBtn handler={delHandler}/> </li>
  )
}

const Input = ({inputlabel, inputvalue, handler }) =>{
  return (
    <div>
      {inputlabel}: <input
       value={inputvalue}
       onChange={handler}
      />
    </div>
  )
}

const PersonForm = ({submitfunction,newName,newPhone,handleNameChange,handleNewNumberChange}) => {
  return(
    <form onSubmit={submitfunction}>
       
        <Input inputlabel={'name'} inputvalue={newName} handler={handleNameChange} />        
        <Input inputlabel={'number'} inputvalue={newPhone} handler={handleNewNumberChange} />
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({personsFiltered, delPerson}) => {
  return(
    <ul>
        {personsFiltered.map(person => 
            <Person key={person.id} person={person} delHandler={()=>delPerson(person)} />
        )}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newPhone, setNewPhone ] = useState('')
  const [ filterText, setFilterText ] = useState('')
  
  const [ personsFiltered, setPersonsFiltered] = useState(persons)  

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then( initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
        setPersonsFiltered(initialPersons)
      })
      .catch(error =>{
        console.log('fail on getting Persons from db')
      })
  }, [])
  console.log('render', persons.length, 'persons')

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
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('') 
        setNewPhone(' ')
        setPersonsFiltered( persons.concat(returnedPerson) ) 
      })     
        
    }
  }

  const delPerson = persontodel =>{
    if(window.confirm(`Doyou really want to delete ${persontodel.name}?`)){
      console.log(`log: deleting ${persontodel.id}`)
    
      personService.remove(persontodel.id)
      .then( () =>{
        setPersons(persons.filter(person => person.id !== persontodel.id ))
        setPersonsFiltered(persons.filter(person => person.id !== persontodel.id ))      
      } )
      .catch(error => {
        console.log(error)
        console.log(`maybe failed to delete ${persontodel.id}`)
      })

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
      <Input inputlabel={'Filter numbers:'} inputvalue={filterText} handler={handleFilterChange} />
      <h2>add New</h2>
      <PersonForm submitfunction={addPerson} newName={newName} newPhone={newPhone} handleNameChange={handleNameChange} handleNewNumberChange={handleNewNumberChange} />
      <h2>Numbers</h2>
      <Persons personsFiltered={personsFiltered} delPerson={delPerson} />
      
      ---
      <div>debug: {newName}</div>
      <div>debug Phone: {newPhone}</div>
      <div>debug filer text: {filterText}</div>
    </div>
  )

}
export default App