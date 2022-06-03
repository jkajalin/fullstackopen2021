import { useSelector } from 'react-redux'

const User = ({ user }) => {

  return (
    <>
      {user.nimi} has {user.blogs.length} blogs <br />
    </>
  )

}

const UserList = () => {

  //const dispatch = useDispatch()
  const users = useSelector(state => state.users)


  return (
    <>
      <h2>UserList</h2>

      {users.map(user =>
        <User key={user.id} user={user} />

      )}
    </>
  )
}



export default UserList