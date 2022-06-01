import { useSelector } from 'react-redux'


const ErrorMsg = () => {
  const errorMsg = useSelector(state => state.errormsg)

  if (errorMsg === null || errorMsg === '') {
    return null;
  }
  return <div className="error">{errorMsg}</div>;
}

export default ErrorMsg