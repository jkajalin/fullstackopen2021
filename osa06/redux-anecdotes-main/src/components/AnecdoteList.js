import { useDispatch, useSelector } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'

const Anecdote = ( { dote } ) => {  
  const dispatch = useDispatch()
  
  const vote = (id) => {
    console.log('vote for id:', id)
    dispatch(voteFor(id))
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
  const anecdotes = useSelector(state => state)
  //console.log(anecdotes)
  
  return(
    <>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          dote={anecdote}
        />
      )}
    </> 
  )
}

export default AnecdoteList