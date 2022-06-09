import { useSelector } from 'react-redux'
import Alert from 'react-bootstrap/Alert'

const Notification = () => {
  const message = useSelector(state => state.notification)
  if (message === null || message === '') {
    return null;
  }

  return <Alert variant="success">{message}</Alert>
}

export default Notification