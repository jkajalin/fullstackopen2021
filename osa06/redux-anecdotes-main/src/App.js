import { useEffect } from 'react'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

//import anecdoteService from './services/anecdotes'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'

const App = () => {

  const dispatch = useDispatch()
  useEffect(() => {
    /*
    anecdoteService
      .getAll().then(anecdotes => dispatch(setAnecdotes(anecdotes)))
    */
    dispatch(initializeAnecdotes())
  }, [dispatch])

  return (
    <div>
      <Notification />      
      <AnecdoteList />
      <AnecdoteForm />      
    </div>
  )
}

export default App