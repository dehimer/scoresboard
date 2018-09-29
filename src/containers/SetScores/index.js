import React, { Component } from 'react';
import { connect } from 'react-redux'

import './index.scss'
import {Button, Card, CardContent, TextField} from '@material-ui/core';

class SetScores extends Component {
  state = {
    code: '',
    scores: 0
  };

  handleClick() {
    const { setScores } = this.props;
    setScores(this.state);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    }, () => {
      const { code } = this.state;
      const { findPlayer } = this.props;

      findPlayer({ code: code*1 });
    });
  };

  render() {
    const { last_found_player } = this.props;
    console.log('last_found_player');
    console.log(last_found_player);

    return (
      <div className='set-scores-wrapper'>
        <Card>
          <CardContent>
            <form className='set-scores'>
              <h3 className='set-scores__header'>Начисление баллов</h3>

              <TextField
                className='set-scores__input' type='text' label='ID'
                variant='outlined' margin='dense'
                value={ this.state.code }
                onChange={ this.handleChange('code') }
              />
              <TextField
                className='set-scores__input' type='number' label='Количество баллов'
                variant='outlined' margin='dense'
                value={ this.state.scores }
                onChange={ this.handleChange('scores') }
              />

              <div>
                { last_found_player ? last_found_player.email : 'User with this ID is not exist' }
              </div>

              <div className='set-scores__spacer'/>

              <Button disabled={!this.state.code} className='set-scores__input' onClick={::this.handleClick}  variant='contained' color='primary'>
                Начислить
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  const { last_found_player } = state.server;

  return {
    last_found_player
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setScores: (player) => {
      dispatch({ type: 'server/set_player_scores', data: player });
    },
    findPlayer: (player) => {
      dispatch({ type: 'server/find_player', data: player });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetScores);
