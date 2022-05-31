import { useState } from "react";
import PropTypes from "prop-types";
//import blogService from '../services/blogs'

// u is logged in user object, (does not have id data), needed to show delete blog button
const Blog = ({ blog, handleLike, handleDel, u }) => {
  const [visible, setVisible] = useState(false);
  const [blogLikes, setBlogLikes] = useState(blog.likes);

  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    lineHeight: "1.5em",
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const addLike = (event) => {
    event.preventDefault();
    blog.likes++;
    handleLike({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: blog.user,
    });
    setBlogLikes(blog.likes);
  };

  return (
    <div style={blogStyle} className="blog">
      <div onClick={toggleVisibility}>
        {blog.title} - {blog.author}
      </div>

      <div style={showWhenVisible} className="togglableContent">
        Likes: {blogLikes} <button onClick={addLike}>Like</button>
        <br />
        URL: {blog.url}
        <br />
        {/* Show delete button when blog.user exist and nimi equals blog.user.nimi === u.nimi
         Solution will work until user nimi is changed, if this functionality will be added later.
         User id based solution would be better
      */}
        {blog.user && blog.user.nimi === u.nimi ? (
          <>
            <button onClick={() => handleDel(blog)}>Delete</button>
          </>
        ) : (
          <> </>
        )}
      </div>
    </div>
  );
};

Blog.propTypes = {
  handleLike: PropTypes.func.isRequired,
  handleDel: PropTypes.func.isRequired,
  blog: PropTypes.object.isRequired,
};

export default Blog;
