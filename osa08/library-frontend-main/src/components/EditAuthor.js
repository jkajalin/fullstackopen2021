import { useMutation } from '@apollo/client'
import { useState, useRef } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import Select from 'react-select'

const EditAuthor = (props) => {
  //const [ name, setName ] = useState('')
  const [ born, setBorn ] = useState('')
  const [ selectedOption, setSelectedOption ] = useState (null)
  const selectInputRef = useRef()

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  if (!props.authors)  {
    return <div>authors props missing...</div>
  }

  const options = props.authors.map( (a) => ( { value: a.name, label: a.name } ) )

  const submit = async ( event ) => {
    event.preventDefault()    
    
    //console.log(selectedOption.value)
    //const n = selectedOption.value
    
    console.log('setBornTo')
    editAuthor({ variables: { name:selectedOption.value, born }})

    //setName('')
    setBorn('')
    //setSelectedOption(null)
    selectInputRef.current.setValue('')
  }

  return(
    <div >
      <form onSubmit={submit}>
        <div>
          name:
          <Select
            ref={selectInputRef}
            name={'name'}            
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={options}
            />
          {/**
           <input 
            value={name}
            onChange={({target}) => setName(target.value)}
          />   
          */}  
               
          
        </div>
        <div>
          born:
          
          <input
              value={born}
              onChange={({target}) => setBorn(Number(target.value))}              
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )

}

export default EditAuthor