import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers:{
    setNewNotification(state, action){
      const content = action.payload    
      return content
    },
    clearNotification(state, action){
      return initialState
    }
  }
})

/*
Set notification message for a given time in seconds
IC: msg != null && seconds > 0
*/
export const setNotification = ( msg , seconds ) => {
  return async dispatch => {
    
    dispatch(setNewNotification( msg ))
    setTimeout(() => {
      dispatch( clearNotification() )
    }, seconds * 1000)
  }
}

export const { setNewNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer