import React, { Component } from 'react';
import { connect } from 'react-redux'

import './index.scss'

class AdminPanel extends Component {
  render() {
    // const { } = this.state;


    return (
      <div className='admin-panel'>
      </div>
    );
  }
}

const mapStateToProps = function (/*state*/) {
  // const { } = state.server;

  return {
  }
};

const mapDispatchToProps = (/*dispatch*/) => {
  return {
    // setTournamentNumber: (tournamentNumber) => {
    //   dispatch({ type: 'server/set_tournament_number', data: tournamentNumber });
    // },
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPanel);
