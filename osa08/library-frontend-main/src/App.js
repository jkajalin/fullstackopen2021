import { useState, useEffect } from 'react'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS, ME, BOOK_ADDED } from './queries'
import LoginForm from './components/LoginForm'
import BooksByGenre from './components/BooksByGenre'

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  //const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  
  // alkuperäinen useApolloClient() paikka ennen 28092022 16.27 muutosta
  
  const [showLogin, setShowLogin] = useState(false)
  //const [user, setUser] = useState('') // Auheuttaa ikuisen päivitys loopin?
  let user = ''

  useEffect(() => {
      if(!token){
        setToken(localStorage.getItem('library-user-token'))
        setShowLogin(false)      
      }
    }, [] // eslint-disable-line
  )

  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 4000
  })
  
  
  const bookResult = useQuery(ALL_BOOKS, {  
    pollInterval: 4000     
  })
  

  
  const userResult = useQuery(ME, {    
    skip: !token && user,
  })
  if( !userResult.loading && userResult.data.me !=null){
    //setUser(userResult.data.me)
    user = userResult.data.me
  }

  const client = useApolloClient()
  
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setShowLogin(false)
  }
  
  const login = () => {
    setShowLogin(true)
  }

  /*
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
      console.log(subscriptionData)
      window.alert('new book added')
      console.log('book added')
      
      
    }
  })
  */
  
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {

      const addedBook = subscriptionData.data.bookAdded
      console.log(`${addedBook.title} added`)
      //console.log(subscriptionData)
      //console.log('subscription: book added')
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook) // seurauksena vain yksi kirja näkyy listattuna, jos samalla kyselyn ALL_BOOKS poll interval pois päältä.
      window.alert(`Book titled ${addedBook.title} added`)
    }
  })
  

  if (result.loading)  {
    return <div>loading...</div>
  }
  if (bookResult.loading)  {
    return <div>loading books...</div>
  }  

/*
  if (!token ) {
    return (
      <div>        
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}          
        />
      </div>
    )
  }
*/

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommended')}>recommended</button>
      </div>
      {/*<button onClick={logout}>logout</button>*/}
      { !token && showLogin === false ? 
        <button onClick={login}>Login</button>
        : null
      }

      { !token && showLogin === true ? 
        <div>        
          <h2>Login</h2>
          <LoginForm
            setToken={setToken}          
          />
        </div>
        : null
      }

      { !token && !user ? null : 
        <div> 
          <button onClick={logout}>logout</button> 
          <br /><br /> Hello {user.username}
        </div> 
      }

      <Authors show={page === 'authors'} authors = {result.data.allAuthors} />

      <Books show={page === 'books'} books = {bookResult.data.allBooks} />

      <NewBook show={page === 'add'} />

      { !token && !user ? null : <div><BooksByGenre show={page === 'recommended'} genre = {user.favoriteGenre} /> </div> }
      
       {/* toistaiseksi static, jatketaan tästä, userin favorite  */ }
    </div>
  )
}

export default App
