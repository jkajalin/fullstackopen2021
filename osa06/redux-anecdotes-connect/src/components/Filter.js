import { connect } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = (props) => {
  
  const handleChange = (event) => {
    event.preventDefault()
    // input-kentän arvo muuttujassa event.target.value
    console.log(event.target.value)
    props.setFilter(event.target.value)
    
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

/*
const mapStateToProps = (state) => {
  return {
    filter: state.fltr,
  }
}
*/

const mapDispatchToProps = {
  setFilter,
}

const ConnectedFilter = connect ( null, mapDispatchToProps )(Filter)

export default ConnectedFilter