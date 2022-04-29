const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

export const voteFor = (id) => { 
  return {
    type: 'VOTE',
    data: { id }
  }
}

export const createAnecdote = (content) => { 
  return {
    type: 'NEW_ANECDOTE',
    data: {
      content,
      id: getId(),
      votes: 0
    }
  }
}

// Sort anecdotes by votes
const sortByVotes = ( toSort ) => {
  toSort.sort( (firstItem, secondItem) => {
    if (firstItem.votes < secondItem.votes) return 1
    if (firstItem.votes === secondItem.votes) return 0
    if (firstItem.votes > secondItem.votes) return -1
    else return 0
  })  
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'VOTE':
      const id = action.data.id
      const anecdoteToVote = state.find(n => n.id === id)
      const votedAnecdote = { 
        ...anecdoteToVote, 
        votes: anecdoteToVote.votes+1 
      }
      const mappedAnecdotes = state.map(anecdote => anecdote.id !== id ? anecdote : votedAnecdote )
      sortByVotes(mappedAnecdotes) // sorting only here works until database, actions or more functions added. Sorting can be implemented as action.
      return mappedAnecdotes
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    case 'ZERO':
      return initialState
    default: // jos ei mikään ylläolevista tullaan tänne
    return state
  }
}

export default reducer