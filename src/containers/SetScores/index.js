import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, Card, CardContent, TextField, Chip, Snackbar } from '@material-ui/core';

import './index.scss'

class SetScores extends Component {
  state = {
    idInputTouched: false,
    player: {
      code: '',
      scores: ''
    },
    showSnackbar: false
  };

  componentWillReceiveProps(nextProps) {
    const {
      last_updated_player: updated_player_next,
      last_found_player: found_player_next
    } = nextProps;
    const {
      last_updated_player: updated_player_prev,
      last_found_player: found_player_prev
    } = this.props;

    let updated_player_changed = false;
    if (updated_player_next) {
      if (!updated_player_prev) {
        updated_player_changed = true;
      } else if (updated_player_prev.scores !== updated_player_next.scores) {
        updated_player_changed = true;
      }
    }

    if (updated_player_changed) {
      this.setState({
        showSnackbar: true
      })
    }


    let found_player_changed = false;
    if (found_player_next) {
      if (!found_player_prev) {
        found_player_changed = true;
      } else if (found_player_prev.code !== found_player_next.code && found_player_next.code > 0) {
        found_player_changed = true;
      } else if (found_player_prev.scores !== found_player_next.scores) {
        found_player_changed = true;
      }
    }

    if (found_player_changed) {
      const { scores='' } = found_player_next;
      const { player } = this.state;

      this.setState({
        player: {
          ...player,
          scores
        }
      })
    }
  }

  handleCloseSnackbar() {
    this.setState({
      showSnackbar: false
    })
  }

  handleClick() {
    const { setScores } = this.props;
    const { code, scores } = this.state.player;
    setScores({ code: +code, scores: +scores });
  }

  handleChange = name => event => {
    const value = event.target.value * 1;
    this.setState({
      idInputTouched: true,
      player: {
        ...this.state.player,
        [name]: isNaN(+value) ? '' : +value
      }
    }, () => {
      if (name === 'code') {
        const { code } = this.state.player;
        const { findPlayer } = this.props;

        findPlayer({ code });
      }
    });
  };

  render() {
    const { last_found_player, last_updated_player } = this.props;
    const { player, idInputTouched } = this.state;

    const userFound = last_found_player && last_found_player.code > 0;

    let foundPlayerEmail = null;
    if (idInputTouched) {
      if (userFound) {
        foundPlayerEmail = (
          <Chip
            label={ `Пользователь найден: ${last_found_player.email}` }
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
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          open={this.state.showSnackbar}
          autoHideDuration={6000}
          onClose={::this.handleCloseSnackbar}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id='message-id'>Player with ID {last_updated_player && last_updated_player.code} is succesfully updated</span>}
        />
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

              { foundPlayerEmail }

              <TextField
                className='set-scores__input' type='text' label='Количество баллов'
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
  const { last_found_player, last_updated_player } = state.server;

  return {
    last_found_player,
    last_updated_player
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
