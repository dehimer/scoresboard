import React, { Component } from 'react';
import { connect } from 'react-redux'
// import { Button, Card, CardContent, TextField, Chip, Snackbar } from '@material-ui/core';


import './index.scss'

class Activity extends Component {
  state = {
  };

  render() {
    const { activities, currency, match: { params: { id } } } = this.props;

    if (activities) {
      console.log(`id: ${id}`);
      console.log('activities');
      console.log(activities);
      const activity = activities && activities[id];
      console.log('activity');
      console.log(activity);
      const { variants=[] } = activity;

      console.log('variants');
      console.log(variants);
      return (
        <div className='activity'>
          <div className='activity__variants'>
            {
              variants.map((variant, idx) => (
                <div key={idx} className='activity__variant'>
                  <div>
                    {variant.text}
                  </div>
                  <div>
                    {variant.price}
                  </div>
                  <div>{currency}</div>
                </div>
              ))
            }
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = function (state) {
  const { activities, currency } = state.server;

  return { activities, currency }
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
