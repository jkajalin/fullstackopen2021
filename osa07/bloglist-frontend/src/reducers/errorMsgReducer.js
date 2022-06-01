import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

// This copy on notification should not even exist. Should be combined with notification.
const errormsgSlice = createSlice({
  name: 'errormsg',
  initialState,
  reducers: {
    setErrorMsg(state, action) {
      const content = action.payload
      return content
    },
    clearErrorMsg() {
      return initialState
    }
  }
})

/*
Set notification message for a given time in seconds
IC: msg != null && seconds > 0
*/
export const createErrorMsg = (msg, seconds) => {
  return async dispatch => {

    dispatch(setErrorMsg(msg))
    setTimeout(() => {
      dispatch(clearErrorMsg())
    }, seconds * 1000)
  }
}

export const { setErrorMsg, clearErrorMsg } = errormsgSlice.actions
export default errormsgSlice.reducer