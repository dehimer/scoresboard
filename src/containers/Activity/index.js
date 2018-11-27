import React, { Component } from 'react';
import { connect } from 'react-redux'

import logo from '../../assets/images/logo.png';

import Balance from './components/Balance';
import SingleVariant from './components/SingleVariant';
import MultipleVariants from './components/MultipleVariants';

import RfidWaiting from './components/RfidWaiting';


import './index.scss'


class Activity extends Component {
  state = {
  };

  onSelectVariant(data) {
    const { variantSelected } = this.props;
    variantSelected(data);
  }

  render() {
    const { activities, currency, match: { params: { id } } } = this.props;

    if (activities) {
      const activity = activities && activities[id];
      const { variants=[], header, selected } = activity;

      return (
        <div className='activity'>
          <div className='logo'><img src={logo}/></div>

          { header ? <div className='header'>{header}</div> : null }

          <div className='content'>
          {
            selected ? (
              <RfidWaiting selected={selected}/>
            ) : (
              variants.length === 1 ? (
                variants[0].balanceChecking ? (
                  <Balance text={variants[0].text} currency={currency}/>
                ) : (
                  <SingleVariant
                    variant={variants[0]}
                    currency={currency}
                    select={(variant) => this.onSelectVariant({ variant, activityId: id })}
                  />
                )
              ) : (
                <MultipleVariants
                  variants={variants}
                  currency={currency}
                  select={(variant) => this.onSelectVariant({ variant, activityId: id })}
                />
              )
            )
          }
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
}

const mapStateToProps = function (state) {
  const { activities, currency } = state.server;

  return { activities, currency }
};

const mapDispatchToProps = (dispatch) => {
  return {
    variantSelected: (data) => {
      dispatch({ type: 'server/variant_selected', data });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity);
