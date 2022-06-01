import { useState, useEffect, useRef } from "react";
//import { useDispatch, useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
//import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
//import { createBlog, initializeBlogs, setBlogs, sortByLikes } from "./reducers/blogReducer";
import { createBlog, initializeBlogs } from "./reducers/blogReducer";
import { createNotification } from "./reducers/notificationReducer";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./style.css";
import Notification from "./components/Notification";
import ErrorMsg from "./components/ErrorMsg";
import { createErrorMsg } from "./reducers/errorMsgReducer";
import BlogList from "./components/BlogList";

const App = () => {
  const dispatch = useDispatch()
  //const [blogs, setBlogs] = useState([]);
  //const blogs = useSelector(state => state.blogs) // blogs from store
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);


  const blogFormRef = useRef();

  useEffect(async () => {
    //sortByLikes(await blogService.getAll());
    dispatch(initializeBlogs())
    console.log('blogs initialized')
  }, [dispatch]); //maybe  [dispatch] ?
  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJson) {
      const parsedUser = JSON.parse(loggedUserJson);
      setUser(parsedUser);
      //console.log(`Parsed token: ${parsedUser.token}`)
      blogService.setToken(parsedUser.token);
    }
  }, []);

  /*
  // Sort blogs by likes ==> moved inside set 
  const sortByLikes = (sblogs) => {
    //console.log('sort by likes')
   
    setBlogs( //use dispatch here
      sblogs.sort((firstItem, secondItem) => {
        if (firstItem.likes < secondItem.likes) return 1
        if (firstItem.likes === secondItem.likesb) return 0
        if (firstItem.likes > secondItem.likes) return -1
      })
    )
  }
  */
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

      dispatch(createErrorMsg("wrong credentials", 5))
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
      const responseBlog = dispatch(createBlog(blogObject))

      if (responseBlog) {
        //console.log(`${responseBlog.title} added succsesfully`)
        dispatch(createNotification(`${responseBlog.title} added succsesfully`, 5))
      }
    } catch (exception) {

      dispatch(createErrorMsg("Creating new blog item failed", 5))
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
      <BlogList user={user} />
      <br />
    </>
  );

  return (
    <div>
      <Notification />
      <ErrorMsg />
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
