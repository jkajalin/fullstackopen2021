//import { useSelector, useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import Blog from "../components/Blog"
//import blogService from "../services/blogs"
//import { addLikeTo, setBlogs, sortByLikes } from "../reducers/blogReducer"
//import { setBlogs } from "../reducers/blogReducer"
//import { createNotification } from "../reducers/notificationReducer"
//import { createErrorMsg } from "../reducers/errorMsgReducer"


const BlogList = ({ user }) => {

  //const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  //const users = useSelector(state => state.users)
  /*
  const handleLikeButton = async (blogObject) => {
        
    dispatch(addLikeTo(blogObject))
  };
  */
  /*
  const handleDelete = async (blg) => {
    if (window.confirm(`Delete blog ${blg.title}?`)) {
      //console.log(`log: deleting ${blg.id}`)
      try {
        await blogService.remove(blg.id);
        const edited = blogs.filter((blog) => blog.id !== blg.id);
        setBlogs(edited);
        dispatch(createNotification(`${blg.title} deleted succsesfully`, 5))

      } catch (error) {
        console.log(error);
        dispatch(createErrorMsg("Maybe blog is not created by this user", 5))
      }
    }
  }
  */

  //console.log('u.id: ', user.id) // debug stuff for Blog component
  return (
    <>
      <h2>BlogList</h2>

      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          //handleLike={handleLikeButton}
          //handleDel={handleDelete}
          u={user}
        />
      )}
    </>
  )
}



export default BlogList