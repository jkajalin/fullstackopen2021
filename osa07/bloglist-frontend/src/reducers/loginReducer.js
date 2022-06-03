import { createSlice } from '@reduxjs/toolkit'
import blogService from "../services/blogs"

const initialState = null

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser(state, action) {
      const user = action.payload
      return user
    },
    initLogin() {
      return initialState
    },
    setUserId(state, action) {
      const userObject = state
      const modified = userObject.id = action.payload
      setUser(modified)
    }
  }
})


export const setLogin = (parsedUser) => {
  return async dispatch => {

    dispatch(setUser(parsedUser))
    blogService.setToken(parsedUser.token);
  }
}

export const { setUser, initLogin, setUserId } = loginSlice.actions

export default loginSlice.reducer

