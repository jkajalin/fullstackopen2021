import { useState, useEffect } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'
import LoginForm from './components/LoginForm'

const App = () => {
  const [token, setToken] = useState(null)
  //const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
      if(!token){
        setToken(localStorage.getItem('library-user-token'))
        setShowLogin(false)      
      }
    }, [] // eslint-disable-line
  )

  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 2000
  })
  
  
  const bookResult = useQuery(ALL_BOOKS, {  
    pollInterval: 2000     
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setShowLogin(false)
  }
  
  const login = () => {
    setShowLogin(true)
  }

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

      { !token ? null : <button onClick={logout}>logout</button> }

      <Authors show={page === 'authors'} authors = {result.data.allAuthors} />

      <Books show={page === 'books'} books = {bookResult.data.allBooks} />

      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App
