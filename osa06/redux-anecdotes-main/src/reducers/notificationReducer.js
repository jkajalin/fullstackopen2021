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
    clearNotification(state, action){
      return initialState
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer