import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import Filter from './Filter'


const Anecdote = ( { dote } ) => {  
  const dispatch = useDispatch()
  
  const vote = async (dote) => {
    console.log('vote for id:', dote.id)
    dispatch(addVote(dote))
    dispatch(setNotification( `+1 vote for: ${dote.content}`, 5))    
  }
  
  return(
    <div>
      {dote.content} -
      has {dote.votes} votes &nbsp;
      <button onClick={() => vote(dote)}>vote</button>
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