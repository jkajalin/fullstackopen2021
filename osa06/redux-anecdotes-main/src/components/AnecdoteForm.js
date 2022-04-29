import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = (props) => {
  const dispatch = useDispatch()

  
    
  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdotnpt.value
    event.target.anecdotnpt.value = ''
    dispatch(createAnecdote(content))
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