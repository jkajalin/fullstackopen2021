import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { createNotification } from "./reducers/notificationReducer";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./style.css";

const Notification = () => {
  const message = useSelector(state => state.notification)
  if (message === null || message === '') {
    return null;
  }

  return <div className="notification">{message}</div>;
};

const ErrorMsg = ({ message }) => {
  if (message === null || message === '') {
    return null;
  }
  return <div className="error">{message}</div>;
};

const App = () => {
  const dispatch = useDispatch()
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  //const [notification, setNotification] = useState(null); // jatka notificaationden dispatchaamista, korvaa loputkin. Muutoksia notification componentin renderöintiin?
  const [errorMsg, setErrorMsg] = useState(null);

  const blogFormRef = useRef();

  useEffect(async () => {
    sortByLikes(await blogService.getAll());
    
  }, []);

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJson) {
      const parsedUser = JSON.parse(loggedUserJson);
      setUser(parsedUser);
      //console.log(`Parsed token: ${parsedUser.token}`)
      blogService.setToken(parsedUser.token);
    }
  }, []);

  // Sort blogs by likes
  const sortByLikes = (sblogs) => {
    //console.log('sort by likes')
   
    setBlogs(
      sblogs.sort((firstItem, secondItem) => {
        if (firstItem.likes < secondItem.likes) return 1;
        if (firstItem.likes === secondItem.likesb) return 0;
        if (firstItem.likes > secondItem.likes) return -1;
      })
    );
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        kayttajanimi: username,
        salasana: password,
      });
      setUser(user);
      setUsername("");
      setPassword("");
      //console.log('token', user.token)
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      //console.log(`Login token ${user.token}`)
      blogService.setToken(user.token);
    } catch (exception) {
      setErrorMsg("wrong credentials");
      setTimeout(() => {
        setErrorMsg(null);
      }, 5000);
    }
    //console.log('logging in with', username, password)
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  const addNewBlogItem = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      const responseBlog = await blogService.create(blogObject);
      if (responseBlog) {
        setBlogs(blogs.concat(responseBlog));
        //console.log(`${responseBlog.title} added succsesfully`)
        dispatch(createNotification(`${responseBlog.title} added succsesfully` ,5 ))        
      }
    } catch (exception) {
      setErrorMsg("Creating new blog item failed");
      setTimeout(() => {
        setErrorMsg(null);
      }, 5000);
    }
  };

  const handleLikeButton = async (blogObject) => {
    try {
      await blogService.update(blogObject.id, blogObject);

      const likedBlogs = blogs.map((blog) =>
        blog.id === blogObject.id ? blogObject : blog
      );
      sortByLikes(likedBlogs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (blg) => {
    if (window.confirm(`Delete blog ${blg.title}?`)) {
      //console.log(`log: deleting ${blg.id}`)
      try {
        await blogService.remove(blg.id);
        const edited = blogs.filter((blog) => blog.id !== blg.id);
        setBlogs(edited);
        dispatch(createNotification(`${blg.title} deleted succsesfully`, 5))
        /*
        setNotification(`${blg.title} deleted succsesfully`);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
        */
      } catch (error) {
        console.log(error);
        setErrorMsg("Maybe blog is not created by this user");
        setTimeout(() => {
          setErrorMsg(null);
        }, 5000);
        //console.log(`Maybe blog is not created by this user?`)
      }
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        Username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          id="usrn"
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          id="pswd"
        />
      </div>
      <button type="submit" id="login-btn">
        Login
      </button>
    </form>
  );

  const blogForm = () => (
    <Togglable buttonLabel="Add new blog item" ref={blogFormRef}>
      <BlogForm createBlog={addNewBlogItem} />
    </Togglable>
  );

  const blogListView = () => (
    <>
      <h2>blogs</h2>
      {user.nimi} is logged in
      <br />
      <button onClick={handleLogout}>logout</button>
      <br />
      <br />
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLikeButton}
          handleDel={handleDelete}
          u={user}
        />
      ))}
      <br />
    </>
  );

  return (
    <div>
      <Notification />
      <ErrorMsg message={errorMsg} />
      {user === null ? (
        loginForm()
      ) : (
        <>
          {blogListView()}
          {blogForm()}
        </>
      )}
    </div>
  );
};

export default App;
