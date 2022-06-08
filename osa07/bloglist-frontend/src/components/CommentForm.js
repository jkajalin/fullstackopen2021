import { useState } from "react"
//import PropTypes from "prop-types"
import { useDispatch } from 'react-redux'
import { addCommentTo } from "../reducers/blogReducer"
import { createNotification } from "../reducers/notificationReducer"
import { createErrorMsg } from "../reducers/errorMsgReducer"


// const BlogForm = ({ createBlog })
const CommentForm = ({ blog }) => {
  //const blogFormRef = useRef();
  const dispatch = useDispatch()

  const [newComment, setNewComment] = useState("");


  const addNewComment = (event) => {
    event.preventDefault()

    const blogObject = {
      ...blog,
      comments: blog.comments.concat(newComment)
    }
    //blogObject.comments.concat(newComment)
    try {

      const responseBlog = dispatch(addCommentTo(blogObject))
      if (responseBlog) {


        dispatch(createNotification(`Comment added succsesfully`, 5))

      }
    } catch (exception) {

      dispatch(createErrorMsg("Creating new comment failed", 5))
    }

    setNewComment("");
  }

  return (
    <>
      <form onSubmit={addNewComment}>
        <div>
          <input
            type="text"
            value={newComment}
            name="title"
            onChange={({ target }) => setNewComment(target.value)}
            placeholder="new comment"
            id="title-input"
          />
        </div>
        <button type="submit">add comment</button>
      </form>
    </>
  )
}


export default CommentForm
