import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { get as getColors } from 'actions/colors'

import './styles.scss'

class App extends Component {
	// componentWillMount() {
		// this.props.getColors();
	// }
  render() {
    return (
      <div className='container'>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = function (state) {
  return {
    colors: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getColors: () => {
      dispatch({type:'server/colors'});
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);