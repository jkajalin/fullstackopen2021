// jatketaan tästä
import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const initializeUsers = () => {
  return async dispatch => {

    const users = await userService.getAll()
    dispatch(setUsers(users))
    console.log('users initialized')
  }
}


export const { setUsers } = userSlice.actions
export default userSlice.reducer