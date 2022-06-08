//import { useSelector, useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import Blog from "../components/Blog"

const BlogList = ({ user }) => {

  //const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  //console.log('u.id: ', user.id) // debug stuff for Blog component
  return (
    <>

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