import { useQuery } from '@apollo/client'
import { FIND_BOOKS_BY_GENRE } from '../queries'

const BooksByGenre = (props) => {

  let books = []
  //const [selectedGenre, setSelectedGenre] = useState('')
  let selectedGenre = ''
  if (props.genre) {
    selectedGenre = props.genre
    //setSelectedGenre(props.genre) 
  }
   
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

  return (
    <div>
      <h2>Recommended Books</h2>    
      <br /><br />
      Favorite genre: {selectedGenre}      
      
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
export default BooksByGenre