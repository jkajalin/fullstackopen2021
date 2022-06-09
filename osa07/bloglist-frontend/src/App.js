import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from 'react-redux'
import BlogForm from "./components/BlogForm"
import Togglable from "./components/Togglable"

import { initializeBlogs } from "./reducers/blogReducer"
import { initializeUsers } from "./reducers/userReducer"

import loginService from "./services/login"
import "./style.css";
import Notification from "./components/Notification"
import ErrorMsg from "./components/ErrorMsg"

import { createErrorMsg } from "./reducers/errorMsgReducer"

import BlogList from "./components/BlogList"
import { initLogin, setLogin, setUserId } from "./reducers/loginReducer"
import UserList from "./components/UserList"

import { Routes, Route, Link, useMatch } from "react-router-dom"
import UserView from "./components/UserView"
import BlogView from "./components/BlogView"

import { Form, Button, Navbar, Nav } from 'react-bootstrap'

const App = () => {
  const padding = {
    padding: 5
  }

  const dispatch = useDispatch()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  //const [user, setUser] = useState(null);
  const user = useSelector(state => state.login)
  const blogs = useSelector(state => state.blogs)
  const users = useSelector(state => state.users)

  const blogFormRef = useRef();

  useEffect(async () => {

    dispatch(initializeBlogs())
    //dispatch(initializeUsers())

  }, [])

  useEffect(async () => {
    if (blogs.length > 0) {
      dispatch(initializeUsers())
    }
    //dispatch(initializeUsers())
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
    <Form onSubmit={handleLogin}>
      <Form.Group>

        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          id="usrn"
        />
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          id="pswd"
        />
        <Button variant="primary" type="submit" id="login-btn">
          Login
        </Button>
      </Form.Group>
    </Form>
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

    <><BlogList user={user} /><br /></>
  );

  const Home = () => {
    //
    return (
      <>
        <>{blogListView()}</>
        <>{blogForm()}</>
        <br />
      </>
    )
  }
  const Users = () => {
    //
    return (

      <UserList />
    )
  }

  const blogMatch = useMatch('/blogs/:id')

  const theBlog = blogMatch
    ? blogs.find(blog => blog.id === String(blogMatch.params.id))
    : null

  const userMatch = useMatch('/users/:id')

  const theUser = userMatch
    ? users.find(user => user.id === String(userMatch.params.id))
    : null

  return (
    <div className="container">

      {user
        ? <>
          <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="#" as="span">
                  <Link style={padding} to="/">blogs</Link>
                </Nav.Link>
                <Nav.Link href="#" as="span">
                  <Link style={padding} to="/users">users</Link>
                </Nav.Link>
                <Nav.Link href="#" as="span">
                  {user.nimi} is logged in
                </Nav.Link>
                <Nav.Link href="#" as="span">
                  <button onClick={handleLogout} >logout</button>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </>
        : <h2>Login</h2>
      }
      <Notification />
      <ErrorMsg />

      {user === null ? (
        loginForm()
      ) : (
        <>
          <h2>Blogs</h2>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserView user={theUser} />} />
            <Route path="/blogs/:id" element={<BlogView blog={theBlog} />} />
          </Routes>


        </>
      )}



    </div>
  )
}

export default App
