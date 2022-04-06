import { useState } from 'react'
//import blogService from '../services/blogs'

const Blog = ({blog, handleLike, handleDel}) => {
  const [visible, setVisible] = useState(false)
  const [blogLikes, setBlogLikes] = useState()

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    lineHeight: '1.5em',
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = ( event ) =>{
    event.preventDefault()
    blog.likes++
    handleLike({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: blog.user
    })    
    setBlogLikes(blog.likes)    
  }

  

  return (
  
  <div style={blogStyle}>
    <div onClick={toggleVisibility}>{blog.title} - {blog.author}</div>
    
    <div style={showWhenVisible}>    
      Likes: {blog.likes}  <button onClick={addLike}>Like</button><br />
      URL: {blog.url}
      <br /><button onClick={ () => handleDel(blog) }>Delete</button>
    </div>
  </div>  
)}

export default Blog