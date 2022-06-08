
// 

import SingleBlog from "./SingleBlog"

//IC: blog != null
const BlogView = ({ blog }) => {

  if (!blog) {
    return null
  }

  return (
    <>
      <SingleBlog blog={blog} />
    </>
  )
}

export default BlogView