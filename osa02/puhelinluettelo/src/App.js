import React, { useState, useEffect } from 'react'
import personService from './services/personsDbCom'
import './style.css'

// Palauttaa yksittäisen Person "olion" poistavan napin, id suoraan handlerille
const DelPersonBtn = ({handler}) => {

  return(
    <button onClick={handler}>delete</button>
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

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const ErrorMsg = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName ] = useState('')
  const [newPhone, setNewPhone ] = useState('')
  const [filterText, setFilterText ] = useState('')
  const [notification, setNotification] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [personsFiltered, setPersonsFiltered] = useState(persons)  

  useEffect(() => {
    console.log('effect')
    // try to hide notification, level clarcson
    //setNotification(null)
    //setErrorMsg(null)    
    setTimeout(() => {
      setNotification(null)
      setErrorMsg(null)
    }, 1)
    
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
      if(window.confirm(`${newName} is already added to phonebook, replace old number with a new one?`)){
        // Päivitetään puhelinnumero
        personService
        .update(nameExist.id, personObject).then( returnedPerson => {
          setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson ))
          setPersonsFiltered(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson ))
          setNotification(
            `Number of '${returnedPerson.name}' was succesfully edited`
          )
          setTimeout(() => {
            setNotification(null)
          }, 3000) 
        } )
        .catch(error => {
          setPersons(persons.filter(person => person.id !== nameExist.id ))
          setPersonsFiltered(persons.filter(person => person.id !== nameExist.id ))
          console.log(error)
          setErrorMsg(
            `Note '${nameExist.name}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMsg(null)
          }, 3000) 
        
        })
      }
    }else{
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('') 
        setNewPhone(' ')
        setPersonsFiltered( persons.concat(returnedPerson) )
        setNotification(
          `Contact '${returnedPerson.name}' was succesfully created`
        )
        setTimeout(() => {
          setNotification(null)
        }, 3000)      
       
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
        setNotification(
          `Person '${persontodel.name}' was succesfully removed from server`
        )
        setTimeout(() => {
          setNotification(null)
        }, 3000)      
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
      <Notification message={notification} />
      <ErrorMsg message={errorMsg} />
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