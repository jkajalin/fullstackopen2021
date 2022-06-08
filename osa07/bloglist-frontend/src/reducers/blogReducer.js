import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { createErrorMsg } from "../reducers/errorMsgReducer"

// Sort blogs by likes
export const sortByLikes = (sblogs) => {
  //console.log('sort by likes')
  /*
  setBlogs(
    sblogs.sort((firstItem, secondItem) => {
      if (firstItem.likes < secondItem.likes) return 1
      if (firstItem.likes === secondItem.likesb) return 0
      if (firstItem.likes > secondItem.likes) return -1
      }
    )
  )
  */

  sblogs.sort((firstItem, secondItem) => {
    if (firstItem.likes < secondItem.likes) return 1
    if (firstItem.likes === secondItem.likesb) return 0
    if (firstItem.likes > secondItem.likes) return -1
  })

}

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    likeBlog(state, action) {
      const id = action.payload
      const blogToLike = state.find(n => n.id === id)
      const likedBlog = {
        ...blogToLike,
        likes: blogToLike.likes + 1
      }
      const mappedBlogs = state.map(blog => blog.id !== id ? blog : likedBlog)
      sortByLikes(mappedBlogs) // sorting only here works until database, actions or more functions added. Sorting can be implemented as action.
      return mappedBlogs
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      const toSort = action.payload
      sortByLikes(toSort) // makes state consistent, in order by likes 
      return toSort
    },
    removeBlog(state, action) {
      const id = action.payload

      const filtered = state.filter(n => n.id !== id)

      return filtered
    },
    commentBlog(state, action) {
      const commentedBlog = action.payload
      const mappedBlogs = state.map(blog => blog.id !== commentedBlog.id ? blog : commentedBlog)
      return mappedBlogs
    },
  }
})

export const { likeBlog, appendBlog, setBlogs, removeBlog, commentBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()

    //sortByLikes(blogs) moved inside setBlogs
    dispatch(setBlogs(blogs))
    console.log('blogs initialized')
    //dispatch(sortByLikes(blogs))
  }
}

export const createBlog = blogObject => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blogObject)
      dispatch(appendBlog(newBlog))
    } catch (error) {
      console.log(error) // expired sessiot paremmin näkyville tällä?
      console.log('expired session, try to login again?')
      dispatch(createErrorMsg("Creating new comment failed. Expired session? Try to login again", 5))
    }

    //dispatch(initializeBlogs()) // force initialize to get all creator data from db
  }
}

// Object vai ID ? object blog servicelle, id tälle reducerille likeBlog(id)
export const addLikeTo = blogobject => {
  return async dispatch => {
    const likedobject = {
      ...blogobject,
      likes: blogobject.likes + 1
    }
    await blogService.update(likedobject.id, likedobject)
    dispatch(likeBlog(blogobject.id))
  }
}

// blogobject is blog object with new comments
export const addCommentTo = blogobject => {
  return async dispatch => {

    await blogService.addComment(blogobject.id, blogobject)
    dispatch(commentBlog(blogobject))
  }
}

export const deleteBLog = id => {
  return async dispatch => {
    try {
      await blogService.remove(id)
      dispatch(removeBlog(id))
    } catch (error) {
      console.log(error) // expired sessiot paremmin näkyville tällä?
      console.log('expired session, try to login again?')
    }
  }
}

export default blogSlice.reducer
