import { useSelector } from 'react-redux'
import Alert from 'react-bootstrap/Alert'


const ErrorMsg = () => {
  const errorMsg = useSelector(state => state.errormsg)

  if (errorMsg === null || errorMsg === '') {
    return null;
  }
  return <Alert variant="warning">{errorMsg}</Alert>;
}

export default ErrorMsg