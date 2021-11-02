import React, { useState, useEffect } from 'react'
import axios from 'axios'


const ListItem = ({listitem}) =>{
  return(
    <li>{listitem}</li>
  )
}

const CountriesList = ({countries}) => {  
  return(
    <ul>
        {countries.map(country => 
          <ListItem key={country.ccn3} listitem={country.name.common} />
        )}
    </ul>
  )
}

const CountriesContent = ({countries}) => {
  if(countries.length>1 && countries.length<=10){
    return(
      <CountriesList countries={countries} />
    )
  }
  else if(countries.length>10){
    return(
      <TextLine text={'Too many countries. Please specify'} />
    )
  }else if(countries.length===1){
    return(
      <div>
      <CountryDetails country={countries[0]} />
      </div>
    )
  }
  return(
    <TextLine text={'Find country details'} />    
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

const TextLine = ({text}) =>{
  return(
    <div>
      <br />{text}
    </div>
  ) 
}

const CountryLanguages = ({langs}) =>{
  
  //console.log('languages '+langs)
  return(
    <>
    <h3>Languages</h3>
    <ul>
        {Object.keys(langs).map(key => 
          <ListItem key={key} listitem={langs[key]} />
        )}
    </ul>
    </>
  )
}

const CountryDetails = ({country}) =>{
  //console.log(country.flags.png)
  
  return(
    
    <div>
      <h2>{country.name.common}</h2>
      <p>
        {country.capital}        
        <br />Population {country.population}
        <br />
        
      </p>
      <CountryLanguages langs={country.languages} />
      <img src={country.flags.png} alt='flag' width='200'  />
      
    </div>
  ) 
}

const App = () => {
  const [ countries, setCountries] = useState([])
  const [ filteredCountries, setFilteredCountries]= useState([])
  const [ filterText, setFilterText ] = useState('')
  const [ filterMessage, setFilterMessage] = useState('')
  
  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])
  console.log('render', countries.length, 'countries')

  const handleCountryFilterChange = (event) => {
    setFilterText(event.target.value)    
    const filtered = countries.filter( countries => countries.name.common.toLowerCase().match(filterText.toLowerCase()) )
    //console.log(filtered)    
    if(countries.length===1){
      console.log('one country set lanngs'+countries[0].languages)
      
    }else if(event.target.value.length>0 && filtered.length<=10){     
      console.log('show filtered')      
      setFilteredCountries( filtered )
      setFilterMessage(' ')
    }else if(filtered.length>0){      
      console.log('else filter change')
      setFilterMessage('Too many matches, please spesify')
      setFilteredCountries( [] )
      
    }    
  }

  return(
    <div>
      <Input inputlabel={'Find country'} inputvalue={filterText} handler={handleCountryFilterChange} />
      <TextLine text={filterMessage} />
      {/*<p>debug ${countries.length}</p>*/}
      <p>debug ${filteredCountries.length}</p>

      <CountriesContent countries={filteredCountries} />
    </div>
  )
}



export default App
