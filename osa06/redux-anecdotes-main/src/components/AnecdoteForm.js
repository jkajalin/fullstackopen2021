import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
//import anecdoteService from '../services/anecdotes'

const AnecdoteForm = (props) => {
  const dispatch = useDispatch() 
    
  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdotnpt.value
    event.target.anecdotnpt.value = ''
    dispatch(createAnecdote(content))
    /*
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
    */
    dispatch(setNotification('New anecdote added'))
    setTimeout(() => {
      dispatch( clearNotification() )
    }, 5000)
  }

  return(
    <>
    <h2>create new</h2>
    <form onSubmit={addAnecdote}>
      <div><input name="anecdotnpt" /></div>
      <button>create</button>
    </form>
    </>
  )
}

export default AnecdoteForm