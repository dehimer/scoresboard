import React, { Component } from 'react';
import { connect } from 'react-redux'

import InputWrapper from '../../components/InputWrapper';
import dottedPrice from '../../utils/dottedPrice';

import './index.scss'
import Logo from '../../components/Logo';

class TopTen extends Component {
  render() {
    let { topten } = this.props;
    const needConcatCount = 10 - topten.length;
    topten = topten.concat(Array(needConcatCount).fill(false));

    return (
      <div className='top-ten'>
        <Logo/>
        <div className='content'>
        {
          topten.map((player, idx) => {
            const { firstName, lastName, spend } = player;
            return (
              <div key={idx} className='player'>
                <InputWrapper lined={true} color={`rgb(255, ${255-255/(idx+1)}, 0)`}>
                  <div> { player ? `${firstName} ${lastName}` : 'Имя'}</div>
                  <div>{ player ? dottedPrice(spend) : 'Баллы'}</div>
                </InputWrapper>
              </div>
            )
          })
        }
        </div>
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  const { topten=[] } = state.server;

  return { topten };
};

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopTen);
