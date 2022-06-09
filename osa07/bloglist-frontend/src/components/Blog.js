import { useState } from "react";
import PropTypes from "prop-types";
import { addLikeTo, deleteBLog } from "../reducers/blogReducer"
import { useDispatch } from 'react-redux'
//import blogService from '../services/blogs'
import { createNotification } from "../reducers/notificationReducer"
import { createErrorMsg } from "../reducers/errorMsgReducer"
import { Link } from 'react-router-dom'

// u is logged in user object, (does not have id data), needed to show delete blog button
const Blog = ({ blog, u }) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false);
  //const [blogLikes, setBlogLikes] = useState(blog.likes);

  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  /*
  const blogStyle = {
    lineHeight: "1.5em",
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  */
  const addLike = (event) => {
    event.preventDefault()

    dispatch(addLikeTo({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: blog.user,
    }))

  };

  const handleDelete = (event) => {
    event.preventDefault()
    if (window.confirm(`Delete blog ${blog.title}?`)) {
      console.log(`log: deleting ${blog.id}`)
      try {
        dispatch(deleteBLog(blog.id))
        dispatch(createNotification(`${blog.title} deleted succsesfully`, 5))

      } catch (error) {
        // expired sessioita ei täältä näe
        console.log(error);
        dispatch(createErrorMsg("Maybe blog is not created by this user", 5))
      }
    }
  }


  return (
    <>
      <div onClick={toggleVisibility}>
        {/*{blog.title} - {blog.author}*/}
        <Link to={`/blogs/${blog.id}`}>{blog.title} - {blog.author}</Link>
      </div>

      <div style={showWhenVisible} className="togglableContent">
        {/*Likes: {blogLikes} <button onClick={addLike}>Like</button>*/}
        Likes: {blog.likes} <button onClick={addLike}>Like</button>
        <br />
        URL: {blog.url}
        <br />
        {/* Show delete button when blog.user exist and nimi equals blog.user.nimi === u.nimi
         Solution will work until user nimi is changed, if this functionality will be added later.
         User id based solution would be better

         // u is logged in user object, does not have id data, needed to show delete blog button
         // solution could be to force updating whole bloglist from database or getting id of logged user by u.nimi from database 
         // feature from assignment 7.14 bring needed information (getting id of logged user by u.nimi from database)
      */}

        {blog.user && blog.user.nimi === u.nimi || blog.user === u.id ? (
          <>
            {/*<button onClick={() => handleDel(blog)}>Delete</button>*/}
            <button onClick={handleDelete}>Delete</button>
          </>
        ) : (
          <> </>
        )}
      </div>
    </>
  );
};

Blog.propTypes = {
  //handleLike: PropTypes.func.isRequired,
  //handleDel: PropTypes.func.isRequired,
  blog: PropTypes.object.isRequired,
};

export default Blog;
