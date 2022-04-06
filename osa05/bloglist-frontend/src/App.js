import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const Button = ( {onClickEvent, btnText} ) => (
  <>
  <button onClick={onClickEvent}>{btnText}</button>
  </>
)

const App = () => {
  
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()
  

  useEffect(() => {
    blogService.getAll().then(blogs =>      
      setBlogs( blogs.sort((firstItem, secondItem) => firstItem.likes < secondItem.likes) )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJson){
      const parsedUser = JSON.parse(loggedUserJson)
      setUser(parsedUser)
      console.log(`Parsed token: ${parsedUser.token}`)
      blogService.setToken(parsedUser.token)
    }
  }, [])

  // Sort blogs by likes
  const sortByLikes = (sblogs) => {
    console.log('sort by likes')    
    const sorted = sblogs.sort((firstItem, secondItem) => firstItem.likes < secondItem.likes )
    setBlogs( sorted )
  }

  const handleLogin = async (event) => {    
    event.preventDefault()
    try {
      const user = await loginService.login({ kayttajanimi: username, salasana: password, })
      setUser(user)   
      setUsername('')
      setPassword('')
      //console.log('token', user.token)      
      window.localStorage.setItem( 'loggedBlogAppUser', JSON.stringify(user) )
      console.log(`Login token ${user.token}`)
      blogService.setToken(user.token)
    } catch (exception) { 
      setErrorMessage('wrong credentials')
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }

    console.log('logging in with', username, password)
    
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
      if(responseBlog){
        setBlogs( blogs.concat(responseBlog) )
        console.log(`${responseBlog.title} added succsesfully`)
        setErrorMessage(`${responseBlog.title} added succsesfully`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }

    }catch(exception){
      setErrorMessage(`Creating new blog item failed`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }  

  }

  const handleLikeButton = async ( blogObject ) =>{ 

    try {
      const responseBlog = await blogService.update( blogObject.id, blogObject  )
      //const editedItem=blogs.find( blog => blog.id === blogObject.id )
      //console.log(`edited item likes ${editedItem.likes}`)
      
      console.log(responseBlog)
      const likedBlogs = blogs.map((blog) => blog.id === blogObject.id ? blogObject : blog )
      sortByLikes(likedBlogs)      

    } catch (error) {
      console.log(error)
    }
    
  }

  const handleDelete = async ( blg ) => {    
    
    if( window.confirm(`Delete blog ${blg.title}?`) ){
      console.log(`log: deleting ${blg.id}`)
      try {
        await blogService.remove(blg.id)
        const edited = blogs.filter(blog => blog.id !== blg.id )      
        setBlogs(edited)
  
      } catch (error) {
          console.log(error)
          console.log(`Maybe blog is not created by this user?`)
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
      <br /><Button onClickEvent={ handleLogout }   btnText='Logout' />
      <br /><br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLikeButton} handleDel={handleDelete} />
      )}
      <br />
    </>
  )
  
  const Notification = ({message}) => (
    <div>
      {message}
    </div>  
  )

  return (
    <div>
      <Notification message={errorMessage} />
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
