import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers:{
    setNotification(state, action){
      const content = action.payload    
      return content
    },
    clearNotification(){
      return initialState
    }
  }
})

/*
Set notification message for a given time in seconds
IC: msg != null && seconds > 0
*/
export const createNotification = ( msg , seconds ) => {
  return async dispatch => {
    
    dispatch(setNotification( msg ))
    setTimeout(() => {
      dispatch( clearNotification() )
    }, seconds * 1000)
  }
}

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer