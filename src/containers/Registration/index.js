import React, { Component } from 'react';
import { connect } from 'react-redux'

import NewPlayer from './components/NewPlayer'
import RegisteredPlayer from './components/RegisteredPlayer'

import './index.scss'

class Registration extends Component {
  render() {
    return (
      <div className='registration'>
        <NewPlayer/>
        <RegisteredPlayer/>
      </div>
    );
  }
}

const mapStateToProps = function (/*state*/) {
  // const {} = state.server;

  return {}
};

const mapDispatchToProps = (/*dispatch*/) => {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration);
