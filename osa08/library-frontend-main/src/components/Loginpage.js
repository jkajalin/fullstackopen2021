import LoginForm from "./LoginForm"

const LoginPage = ( props ) => {

  if (!props.show) {
    return null
  }

  if (!props.token) {
    return (
      <div>        
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}          
        />
      </div>
    )
  }


}

export default LoginPage