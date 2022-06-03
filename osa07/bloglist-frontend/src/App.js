import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
//import { useDispatch } from 'react-redux'
//import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
//import { createBlog, initializeBlogs, setBlogs, sortByLikes } from "./reducers/blogReducer";
//import { createBlog, initializeBlogs } from "./reducers/blogReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import { initializeUsers } from "./reducers/userReducer";

//import blogService from "./services/blogs";
import loginService from "./services/login";
import "./style.css";
import Notification from "./components/Notification";
import ErrorMsg from "./components/ErrorMsg";
//import { createNotification } from "./reducers/notificationReducer";
import { createErrorMsg } from "./reducers/errorMsgReducer";

import BlogList from "./components/BlogList";
import { initLogin, setLogin, setUserId } from "./reducers/loginReducer";
import UserList from "./components/UserList";

const App = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //const [user, setUser] = useState(null);
  const user = useSelector(state => state.login)
  const blogs = useSelector(state => state.blogs)
  const users = useSelector(state => state.users)

  const blogFormRef = useRef();

  useEffect(async () => {
    //sortByLikes(await blogService.getAll());
    dispatch(initializeBlogs())

    //dispatch(initializeUsers())


  }, []) //maybe  [dispatch] ?

  useEffect(async () => {

    dispatch(initializeUsers())
    //console.log(blogs.length)
  }, [blogs.length]) // UserList uudelleen renderöinti, blogien määrän muuttuessa

  useEffect(async () => {
    const loggedUserJson = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJson) {
      const parsedUser = JSON.parse(loggedUserJson);
      dispatch(setLogin(parsedUser))
      //setUser(parsedUser);
      //console.log(`Parsed token: ${parsedUser.token}`)
      //blogService.setToken(parsedUser.token);
      /*
      if (users && user && user.nimi) {
        const theUserId = users.find(n => n.nimi === parsedUser.nimi).id
        console.log('on reload userID: ', theUserId)
        dispatch(setUserId(theUserId))
      }
      */
    }
    /*
    if (users && user && user.nimi) {
      const theUserId = users.find(n => n.nimi === user.nimi).id
      console.log('on reload userID: ', theUserId)
      dispatch(setUserId(theUserId))
    }
    */
  }, []);
  /*
  useEffect(async () => {

    if (users && user && user.nimi != undefined && !user.id) {
      const theUser = users.find(n => n.nimi === user.nimi)
      const theUserId = theUser.id
      console.log('on reload userID: ', theUserId)
      dispatch(setUserId(theUserId))
    }

  }, []);
  */

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        kayttajanimi: username,
        salasana: password,
      });
      //setUser(user);
      dispatch(setLogin(user))

      const theUserId = users.find(n => n.nimi === user.nimi).id
      console.log('on login userID: ', theUserId)
      dispatch(setUserId(theUserId))

      setUsername("")
      setPassword("")
      //console.log('token', user.token)
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      //console.log(`Login token ${user.token}`)
      //blogService.setToken(user.token); //--> dispatch(setLogin(user)) hoitaa tämän
    } catch (exception) {

      dispatch(createErrorMsg("wrong credentials", 5))
    }
    //console.log('logging in with', username, password)
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem("loggedBlogAppUser")
    //setUser(null);
    dispatch(initLogin())
  }

  /*
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
  }
  */
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

  const toggleBlogItem = () => {
    //console.log('toggle')
    blogFormRef.current.toggleVisibility()
    //dispatch(initializeBlogs)
  }

  const blogForm = () => (
    <Togglable buttonLabel="Add new blog item" ref={blogFormRef}>
      {/*<BlogForm createBlog={addNewBlogItem} />*/}
      <BlogForm toggle={toggleBlogItem} />
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
          <UserList />
        </>
      )}
    </div>
  );
};

export default App;
