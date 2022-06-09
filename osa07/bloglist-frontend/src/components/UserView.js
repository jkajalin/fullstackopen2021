
// user is the user not login data
const UserView = ({ user }) => {

  if (!user) {
    return null
  }

  return (
    <>
      <h3>{user.nimi}</h3>
      {/*{user.blogs}*/}
      <>
        <ul>
          {user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}

        </ul>
      </>


    </>
  )

}

export default UserView