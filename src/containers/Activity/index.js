import React, { Component } from 'react';
import { connect } from 'react-redux'

import Logo from '../../components/Logo';
import Balance from './components/Balance';
import SingleVariant from './components/SingleVariant';
import MultipleVariants from './components/MultipleVariants';

import RfidWaiting from './components/RfidWaiting';


import './index.scss'


class Activity extends Component {
  onSelectVariant(data) {
    const { variantSelected } = this.props;
    variantSelected(data);
  }

  onUnselectVariant(activityId) {
    const { variantUnselect } = this.props;
    variantUnselect(activityId);
  }

  render() {
    const {
      activities,
      currency,
      match: { params: { id } },
      denyMessage
    } = this.props;

    if (activities) {
      const activity = activities && activities[id];
      const { variants=[], header, selected, error, player } = activity;

      let content;

      if (error) {
        console.log(error);
        let message;
        if (error === 'rfidInActive') {
          message = 'Карта не зарегистрированна'
        } else if (error === 'tooOften') {
          message = denyMessage;
        } else {
          message = 'Возникла неожиданная ошибка'
        }
        content = (
          <div className='message'>
            {
              Array.isArray(message)
                ? message.map(msg => (<div>{msg}</div>))
                : message
            }
          </div>
        );
      } else if (activity.balanceChecking) {
        content = (<Balance text={activity.text} player={player} currency={currency}/>)
      } else if (player) {
        content = (
          <div>
            <div>spend: {player.spend}</div>
            <div>balance: {player.balance}</div>
          </div>
        )
      } else if (selected) {
        content = (<RfidWaiting selected={selected} customMsg={activity.accept} reset={() => this.onUnselectVariant(id)}/>);
      } else if (variants.length === 1) {
        content = (
          <SingleVariant
            variant={variants[0]}
            currency={currency}
            select={(variant) => this.onSelectVariant({ variant, activityId: id })}
          />
        )
      } else {
        content = (
          <MultipleVariants
            variants={variants}
            currency={currency}
            select={(variant) => this.onSelectVariant({ variant, activityId: id })}
          />
        )
      }

      return (
        <div className='activity'>

          <Logo/>

          { header && !selected ? <div className='header'>{header}</div> : null }

          <div className='content'>
          { content }
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
}

const mapStateToProps = function (state) {
  const { activities, currency, allSpendMessage, denyMessage } = state.server;

  return { activities, currency, allSpendMessage, denyMessage }
};

const mapDispatchToProps = (dispatch) => {
  return {
    variantSelected: (data) => {
      dispatch({ type: 'server/variant_selected', data });
    },
    variantUnselect: (activityId) => {
      dispatch({ type: 'server/variant_unselect', data: activityId });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity);
