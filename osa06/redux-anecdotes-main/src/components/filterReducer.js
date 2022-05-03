import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const filterSlice = createSlice({
  name: 'fltr',
  initialState,
  reducers:{
    setFilter(state, action){
      const content = action.payload    
      return content
    },
    clearFilter(state, action){
      return initialState
    }
  }
})

export const { setFilter, clearFilter } = filterSlice.actions
export default filterSlice.reducer