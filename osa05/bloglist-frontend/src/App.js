import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './style.css'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const ErrorMsg = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const blogFormRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((firstItem, secondItem) => firstItem.likes < secondItem.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJson) {
      const parsedUser = JSON.parse(loggedUserJson)
      setUser(parsedUser)
      //console.log(`Parsed token: ${parsedUser.token}`)
      blogService.setToken(parsedUser.token)
    }
  }, [])

  // Sort blogs by likes
  const sortByLikes = (sblogs) => {
    console.log('sort by likes')
    const sorted = sblogs.sort((firstItem, secondItem) => firstItem.likes < secondItem.likes)
    setBlogs(sorted)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ kayttajanimi: username, salasana: password, })
      setUser(user)
      setUsername('')
      setPassword('')
      //console.log('token', user.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      //console.log(`Login token ${user.token}`)
      blogService.setToken(user.token)
    } catch (exception) {
      setErrorMsg('wrong credentials')
      setTimeout(() => { setErrorMsg(null) }, 5000)
    }
    //console.log('logging in with', username, password)
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const addNewBlogItem = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {

      const responseBlog = await blogService.create(blogObject)
      if (responseBlog) {
        setBlogs(blogs.concat(responseBlog))
        //console.log(`${responseBlog.title} added succsesfully`)
        setNotification(`${responseBlog.title} added succsesfully`)
        setTimeout(() => { setNotification(null) }, 5000)
      }

    } catch (exception) {
      setErrorMsg('Creating new blog item failed')
      setTimeout(() => { setErrorMsg(null) }, 5000)
    }

  }

  const handleLikeButton = async (blogObject) => {

    try {
      await blogService.update(blogObject.id, blogObject)

      const likedBlogs = blogs.map((blog) => blog.id === blogObject.id ? blogObject : blog)
      sortByLikes(likedBlogs)

    } catch (error) {
      console.log(error)
    }

  }

  const handleDelete = async (blg) => {

    if (window.confirm(`Delete blog ${blg.title}?`)) {
      //console.log(`log: deleting ${blg.id}`)
      try {
        await blogService.remove(blg.id)
        const edited = blogs.filter(blog => blog.id !== blg.id)
        setBlogs(edited)
        setNotification(`${blg.title} deleted succsesfully`)
        setTimeout(() => { setNotification(null) }, 5000)
      } catch (error) {
        console.log(error)
        setErrorMsg('Maybe blog is not created by this user')
        setTimeout(() => {
          setErrorMsg(null)
        }, 5000)
        //console.log(`Maybe blog is not created by this user?`)
      }
    }

  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        Username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  )

  const blogForm = () => (
    <Togglable buttonLabel="Add new blog item" ref={blogFormRef}>
      <BlogForm createBlog={addNewBlogItem} />
    </Togglable>
  )

  const blogListView = () => (
    <>
      <h2>blogs</h2>
      {user.nimi} is logged in
      <br /><button onClick={handleLogout}>logout</button>
      <br /><br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLikeButton} handleDel={handleDelete} u={user} />
      )}
      <br />
    </>
  )

  return (
    <div>
      <Notification message={notification} />
      <ErrorMsg message={errorMsg} />
      {user === null ?
        loginForm() :
        <>
          {blogListView()}
          {blogForm()}
        </>
      }
    </div>
  )
}

export default App
