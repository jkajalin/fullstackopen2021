import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {  
    
  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdotnpt.value
    event.target.anecdotnpt.value = ''
    props.createAnecdote(content)
    
    props.setNotification('New anecdote added' ,3 )
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
/*
const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    notification: state.notification,
  }
}
*/

const mapDispatchToProps = {
  createAnecdote,
  setNotification
}

const ConnectedDoteForm = connect (null, mapDispatchToProps)(AnecdoteForm)

export default ConnectedDoteForm