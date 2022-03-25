import { useState, useEffect } from 'react'
import Blog from './components/Blog'
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
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const addNewBlogItem = async (event) => {
    event.preventDefault()
    const newBlogObject ={
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,      
    }
    try {
      const responseBlog = await blogService.create(newBlogObject)
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
    <form onSubmit={addNewBlogItem}>
      <div>
        Title: 
          <input
          type="text"
          value={newBlogTitle}
          name="title"
          onChange={({ target }) => setNewBlogTitle(target.value)}
        />
      </div>
      <div>
        Author: 
          <input
          type="text"
          value={newBlogAuthor}
          name="author"
          onChange={({ target }) => setNewBlogAuthor(target.value)}
        />
      </div>
      <div>
        Url: 
          <input
          type="text"
          value={newBlogUrl}
          name="url"
          onChange={({ target }) => setNewBlogUrl(target.value)}
        />
      </div>
      <button type="submit">Create</button>
    </form>      
  )

  const blogListView = () => (
    <>
      <h2>blogs</h2>
      {user.nimi} is logged in
      <br /><Button onClickEvent={ handleLogout }   btnText='Logout' />
      <br /><br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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
