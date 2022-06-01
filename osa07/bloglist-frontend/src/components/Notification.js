import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector(state => state.notification)
  if (message === null || message === '') {
    return null;
  }

  return <div className="notification">{message}</div>;
};

export default Notification