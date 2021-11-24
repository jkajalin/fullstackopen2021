import React, { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY
console.log('api key outer: ',api_key)
let weather = ''

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

const ShowButton = ({btntext,handler,value}) =>{
  return(
    <>
      <button onClick={handler} value={value}>{btntext}</button>  
    </>
  )
}

const TextLine = ({text}) =>{
  return(
    <div>
      <br />{text}
    </div>
  ) 
}

const ListItem = ({listitem}) =>{
  return(
    <li>{listitem}</li>
  )
}

const CountriesList = ({countries, btnHandler}) => {  
  return(
    <ul>
        {countries.map(country => 
          <><ListItem key={country.ccn3} listitem={country.name.common} /><ShowButton key={country.ccn3+'btn'} btntext={'show'} handler={btnHandler} value={country.ccn3} /></>
        )}
    </ul>
  )
}

const CountriesContent = ({countries, btnHandler}) => {
  console.log('draw countries content')
  if(countries.length>1 && countries.length<=10){
    return(
      <CountriesList countries={countries} btnHandler={btnHandler} />
    )
  }
  else if(countries.length>10){
    return(
      <TextLine text={'Too many countries. Please specify'} />
    )
  }else if(countries.length===1 &&weather){ // add &&weather when effect2 in App component
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

const CountryLanguages = ({langs}) =>{
  
  //console.log('languages ',langs)
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
  let temperature='foo'
  /*
  useEffect(() => {
    console.log('effect2')
    if(country){
      console.log('effect2, county is set, so get weather')
      console.log('url: https://api.weatherstack.com/current?access_key='+api_key+'&query='+country.capital+','+country.name.common)
      axios
      .get('http://api.weatherstack.com/current?access_key='+api_key+'&query='+country.capital+','+country.name.common)
      .then(response => {
        console.log('weather promise fulfilled')
        weather=response.data
        if('current' in weather){
          temperature=weather.current.temperature
          console.log('temperature ',weather.current.temperature)
        }
        
        //setCountries(response.data)
      })
    }
      
      
         
  }, [country])
  */
  if(weather){
    console.log('details, temperature',weather.current.temperature)
    temperature=weather.current.temperature
  }  
  return(
    
    <div>
      <h2>{country.name.common}</h2>
      <p>
        {country.capital}        
        <br />Population: {country.population}
        <br />ccn3: {country.ccn3}
        
      </p>
      <CountryLanguages langs={country.languages} />
      <img src={country.flags.png} alt='flag' width='200'  />
      <br /><br /><h3>Weather in {country.capital}</h3>
      <br />temperature: {temperature}
    </div>
  ) 
}

const getWeatherOfCity = ({city}) => {

}

const App = () => {
  const [ countries, setCountries] = useState([])
  const [ filteredCountries, setFilteredCountries]= useState([])
  const [ filterText, setFilterText ] = useState('')
  const [ filterMessage, setFilterMessage] = useState('')
  const [ selectedCountry, setSelectedCountry] = useState('')
  

  //const api_key2 = process.env.REACT_APP_API_KEY
  
  //console.log('api key: ',api_key)
  //console.log(process.env.WEATHERSTACK_APP_API_KEY)
  //console.log(api_key2)
  useEffect(() => {
    console.log('effect')
    
      //console.log('countries array empty, getting countries')
      axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })    
  }, [])
  //console.log('render2', countries.length, 'countries')
  // weather effect
  useEffect(() => {
    console.log('effect2')
    if(selectedCountry){
      console.log('effect2, county is set, so get weather')
      console.log('url: https://api.weatherstack.com/current?access_key='+api_key+'&query='+selectedCountry.capital+','+selectedCountry.name.common)
      axios
      .get('http://api.weatherstack.com/current?access_key='+api_key+'&query='+selectedCountry.capital+','+selectedCountry.name.common)
      .then(response => {
        console.log('weather promise fulfilled')
        weather=response.data
        if('current' in weather){
          console.log('temperature ',weather.current.temperature)
        }
        
        //setCountries(response.data)
      })
    }

  }, [selectedCountry])

  const handleCountryFilterChange = (event) => {
    setFilterText(event.target.value)
    console.log(event.target.value)    
    const filtered = countries.filter( countries => countries.name.common.toLowerCase().match(filterText.toLowerCase()) )
    console.log('filter event, filtered countries',filtered.length)
    if(event.target.value.length>0 && filtered.length<=10){     
      console.log('show filtered')           
      setFilteredCountries( filtered )
      setFilterMessage(' ')      
      //weather=''
      if(filtered.length===1){
        console.log('filtered one, set selected country')      
        setSelectedCountry(filtered[0])
        console.log('selected country set', filtered[0].name.common)
      }
    }else if(filtered.length>10){      
      console.log('filter event, more than ten countries filtered')
      setFilterMessage('Too many matches, please spesify')
      //setFilteredCountries( [] )    
    }
    
  }

  const handleShowButton = (event) =>{
    //weather=''
    console.log('btnkey in handle ',event.target.value)
    const selected = countries.find( countries => countries.ccn3===event.target.value)
    console.log('selected '+selected.name.common)
    setSelectedCountry(selected)
    setFilteredCountries( [selected] )
    setFilterText('')  
  }
  return(
    <div>
      <Input inputlabel={'Find country'} inputvalue={filterText} handler={handleCountryFilterChange} />
      <TextLine text={filterMessage} />
      {/*<p>debug ${countries.length}</p>*/}
      {/*<p>debug ${filteredCountries.length}</p>*/}

      <CountriesContent countries={filteredCountries} btnHandler={handleShowButton} />
    </div>
  )
}



export default App
