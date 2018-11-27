import React, { Component } from 'react';
import { connect } from 'react-redux'
// import { Button, Card, CardContent, TextField, Chip, Snackbar } from '@material-ui/core';


import './index.scss'

class Activity extends Component {
  state = {
  };

  render() {
    const { match: { params: { id } } } = this.props;
    return (
      <div className='activity'>
        {id}¤
      </div>
    );
  }
}

const mapStateToProps = function (/*state*/) {
  // const {} = state.server;

  return {}
};

const mapDispatchToProps = (/*dispatch*/) => {
  return {
    // addScores: (player) => {
    //   dispatch({ type: 'server/add_scores', data: player });
    // },
    // findPlayer: (player) => {
    //   dispatch({ type: 'server/find_player', data: player });
    // }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity);
