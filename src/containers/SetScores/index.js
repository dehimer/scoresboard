import React, { Component } from 'react';
import { connect } from 'react-redux'

import './index.scss'
import { Button, Card, CardContent, TextField, Chip } from '@material-ui/core';

class SetScores extends Component {
  state = {
    idInputTouched: false,
    player: {
      code: '',
      scores: 0
    }
  };

  handleClick() {
    const { setScores } = this.props;
    setScores(this.state.player);
  }

  handleChange = name => event => {
    this.setState({
      idInputTouched: true,
      player: {
        ...this.state.player,
        [name]: event.target.value * 1
      }
    }, () => {
      console.log(this.state);
      const { code } = this.state.player;
      const { findPlayer } = this.props;

      console.log('code');
      console.log(code);
      findPlayer({ code });
    });
  };

  render() {
    const { last_found_player } = this.props;
    const { player, idInputTouched } = this.state;
    console.log('last_found_player');
    console.log(last_found_player);

    const userFound = last_found_player && last_found_player.code > 0;

    let foundPlayerEmail = null;
    if (idInputTouched) {
      if (userFound) {
        foundPlayerEmail = (
          <Chip
            label={last_found_player.email}
            color='primary'
            variant='outlined'
          />
        )
      } else {
        foundPlayerEmail = (
          <Chip
            label='Пользователь с указанным ID не существует'
            color='secondary'
            variant='outlined'
          />
        )
      }
    }


    return (
      <div className='set-scores-wrapper'>
        <Card>
          <CardContent>
            <form className='set-scores'>
              <h3 className='set-scores__header'>Начисление баллов</h3>

              <TextField
                error={idInputTouched && !userFound}

                className='set-scores__input' type='text' label='ID'
                variant='outlined' margin='dense'
                value={ player.code }
                onChange={ this.handleChange('code') }
              />

              <div>
                { foundPlayerEmail }
              </div>

              <TextField
                className='set-scores__input' type='number' label='Количество баллов'
                variant='outlined' margin='dense'
                value={ player.scores }
                onChange={ this.handleChange('scores') }
              />

              <div className='set-scores__spacer'/>

              <Button disabled={!userFound} className='set-scores__input' onClick={::this.handleClick}  variant='contained' color='primary'>
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
