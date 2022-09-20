import { useState, useEffect } from "react"
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, FIND_BOOKS_BY_GENRE } from '../queries'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('')
  let books = props.books

  /*
  useEffect(() => {
      
    }, [selectedGenre] // eslint-disable-line
  )
  */
  let genres = books.map( b => b.genres ).flat()
   
  const result = useQuery(FIND_BOOKS_BY_GENRE, {
    variables: { selectedGenre },
    skip: !selectedGenre,
  })
  if( selectedGenre && result.data){
    books = result.data.allBooks
  }


  if (!props.show) {
    return null
  }
  
  if (!props.books)  {
    return <div>books props missing...</div>
  }

  

  
  let filteredgenres = []
  
  
  genres.forEach( e => { 
    if(!filteredgenres.includes(e)){
      filteredgenres.push(e)
    }    
  })

  //console.log(genres.flat())
  //genres = genres.map( g => g.find(genres)  )
    



  return (
    <div>
      <h2>books</h2>
      Select genre: { filteredgenres.map( (g) => <button onClick={ () => setSelectedGenre(g)} key={g}>{g}</button>  ) }
      <button onClick={() => setSelectedGenre('')}>all</button>
      <br /><br />
      Selected genre: {selectedGenre}
      {/* selectedGenre!==null ?  books.filter( b => b.genres.find( g => g.toString() === selectedGenre.toString() ) ): null */ }
      
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
            <th>genres</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
              <td>{a.genres.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
