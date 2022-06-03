import { useState } from "react"
//import { useState, useRef } from "react"
import PropTypes from "prop-types";
import { useDispatch } from 'react-redux'
import { createBlog } from "../reducers/blogReducer";
import { createNotification } from "../reducers/notificationReducer";
import { createErrorMsg } from "../reducers/errorMsgReducer";


// const BlogForm = ({ createBlog })
const BlogForm = ({ toggle }) => {
  //const blogFormRef = useRef();
  const dispatch = useDispatch()

  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");
  //const [newBlog, setNewBlog] = useState('')

  /*
  const createBlog = async (blogObject) => {
    //blogFormRef.current.toggleVisibility()
    //fref.current.toggleVisibility()
    try {
      const responseBlog = dispatch(createBlog(blogObject))

      if (responseBlog) {
        //console.log(`${responseBlog.title} added succsesfully`)
        dispatch(createNotification(`${responseBlog.title} added succsesfully`, 5))
      }
    } catch (exception) {

      dispatch(createErrorMsg("Creating new blog item failed", 5))
    }
  }

  */

  const addBlog = (event) => {
    event.preventDefault();

    /*
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    });*/
    try {

      const responseBlog = dispatch(createBlog({ title: newBlogTitle, author: newBlogAuthor, url: newBlogUrl }))
      if (responseBlog) {
        //console.log(`${responseBlog.title} added succsesfully`)
        toggle()
        dispatch(createNotification(`${responseBlog.title} added succsesfully`, 5))
        //dispatch(initializeBlogs)
      }
    } catch (exception) {

      dispatch(createErrorMsg("Creating new blog item failed", 5))
    }
    //setNewBlog('')
    setNewBlogTitle("");
    setNewBlogAuthor("");
    setNewBlogUrl("");
  };

  return (
    <>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input
            type="text"
            value={newBlogTitle}
            name="title"
            onChange={({ target }) => setNewBlogTitle(target.value)}
            placeholder="write title here"
            id="title-input"
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={newBlogAuthor}
            name="author"
            onChange={({ target }) => setNewBlogAuthor(target.value)}
            placeholder="write author here"
            id="author-input"
          />
        </div>
        <div>
          Url:
          <input
            type="text"
            value={newBlogUrl}
            name="url"
            onChange={({ target }) => setNewBlogUrl(target.value)}
            placeholder="write url here"
            id="url-input"
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </>
  );
};


BlogForm.propTypes = {
  //createBlog: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default BlogForm;
