import { configureStore } from '@reduxjs/toolkit'
import filterReducer from '../reducers/filterReducer'
import anecdoteReducer from './anecdoteReducer'
import notificationReducer from './notificationReducer'

const store = configureStore({
  reducer:{
    anecdotes: anecdoteReducer,
    notification: notificationReducer,
    fltr: filterReducer 
  }
})

export default store