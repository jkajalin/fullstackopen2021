//import { useSelector, useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import Blog from "../components/Blog"
import Table from 'react-bootstrap/Table'

const BlogList = ({ user }) => {

  //const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  //console.log('u.id: ', user.id) // debug stuff for Blog component
  return (
    <>
      <Table striped>
        <tbody>
          {blogs.map(blog =>
            <tr key={blog.id}>
              <td>
                <Blog
                  key={blog.id}
                  blog={blog}
                  //handleLike={handleLikeButton}
                  //handleDel={handleDelete}
                  u={user}
                />
              </td>
              <td>{blog.user.nimi}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}



export default BlogList