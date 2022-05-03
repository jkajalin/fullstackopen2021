import { useDispatch, useSelector } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'
import { clearNotification, setNotification } from '../reducers/notificationReducer'
import Filter from './Filter'


const Anecdote = ( { dote } ) => {  
  const dispatch = useDispatch()
  
  const vote = (id) => {
    console.log('vote for id:', id)
    dispatch(voteFor(id))
    dispatch(setNotification( `+1 vote for: ${dote.content}`))
    setTimeout(() => {
      dispatch( clearNotification() )
    }, 5000)
  }  
  return(
    <div>
      {dote.content} -
      has {dote.votes} votes &nbsp;
      <button onClick={() => vote(dote.id)}>vote</button>
    </div>
  )
}


const AnecdoteList = () => {
  //const anecdotes = useSelector(state => state.anecdotes)
  //console.log(anecdotes)
  const anecdotes = useSelector(({ fltr, anecdotes }) => {
    if ( fltr === '' || null ) {
      return anecdotes
    }
    else return anecdotes.filter( anecdote => anecdote.content.toLowerCase().match(fltr.toLowerCase()) )   
  })
  
  return(
    <>
      <h2>Anecdotes</h2>
      <Filter />
      { anecdotes.map( anecdote =>
        <Anecdote
          key={anecdote.id}
          dote={anecdote}
        />
      )}
    </> 
  )
}

export default AnecdoteList