const Blog = ({blog}) => {
  const blogStyle = {
    lineHeight: '1.5em',
  }
  return (
  
  <div style={blogStyle}>
    {blog.title} - {blog.author} - {blog.likes} - {blog.url} <br />
    --- <br />
  </div>  
)}

export default Blog