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

  onSelectVariant(variant) {
    console.log('onSelectVariant');
    console.log(variant);
  }

  render() {
    const { activities, currency, match: { params: { id } } } = this.props;

    if (activities) {
      const activity = activities && activities[id];
      const { variants=[], header } = activity;

      return (
        <div className='activity'>
          <div className='logo'><img src={logo}/></div>
          { header ? <div className='header'>{header}</div> : null }
          <div className='content'>
          {
            variants.length === 1 ? (
              variants[0].balanceChecking ? (
                <Balance text={variants[0].text} currency={currency}/>
              ) : (
                <SingleVariant
                  select={::this.onSelectVariant}
                  variant={variants[0]}
                  currency={currency}
                />
              )
            ) : (
              <MultipleVariants
                variants={variants}
                currency={currency}
                select={::this.onSelectVariant}
              />
            )
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
