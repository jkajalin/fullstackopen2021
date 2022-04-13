import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  //const [newBlog, setNewBlog] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    })
    //setNewBlog('')
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }


  return (
    <>
      <form onSubmit={addBlog} >
        <div>
          Title:
          <input
            type="text"
            value={newBlogTitle}
            name="title"
            onChange={({ target }) => setNewBlogTitle(target.value)}
            placeholder='write title here'
            id='title-input'
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={newBlogAuthor}
            name="author"
            onChange={({ target }) => setNewBlogAuthor(target.value)}
            placeholder='write author here'
            id='author-input'
          />
        </div>
        <div>
          Url:
          <input
            type="text"
            value={newBlogUrl}
            name="url"
            onChange={({ target }) => setNewBlogUrl(target.value)}
            placeholder='write url here'
            id='url-input'
          />
        </div>
        <button type="submit">Create</button>
      </form >
    </>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm