import React, { Component } from 'react';
import { connect } from 'react-redux'

import logo from '../../assets/images/logo.png';
import Balance from './components/Balance';
import SingleVariant from './components/SingleVariant';
import MultipleVariants from './components/MultipleVariants';


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

      // checkBalance, singleVariant, multipleVariants

      console.log('variants');
      console.log(variants);
      return (
        <div className='activity'>
          <div className='logo'><img src={logo}/></div>
          {
            variants.length === 1 ? (
              variants[0].balanceChecking ? (
                <Balance text={variants[0].text} currency={currency}/>
              ) : (
                <SingleVariant variant={variants[0]} currency={currency}/>
              )
            ) : (
              <MultipleVariants variants={variants} currency={currency}/>
            )
          }
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
