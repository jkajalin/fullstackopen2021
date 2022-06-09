import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const User = ({ user }) => {

  return (
    <>

      <Link to={`/users/${user.id}`}>{user.nimi}</Link> has {user.blogs.length} blogs <br />
    </>
  )

}

const UserList = () => {

  //const dispatch = useDispatch()
  const users = useSelector(state => state.users)



  return (
    <>
      <h3>UserList</h3>

      {users.map(user =>
        <User key={user.id} user={user} />

      )}
    </>
  )
}



export default UserList