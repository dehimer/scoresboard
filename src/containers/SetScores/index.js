import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, Card, CardContent, TextField, Chip, Snackbar } from '@material-ui/core';
import MenuBar from '../../components/MenuBar'

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
      updated_player: updated_player_next
    } = nextProps;
    const {
      updated_player: updated_player_prev,
      findPlayer
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
      }, () => {
        findPlayer({ code: updated_player_next.code })
      })
    }
  }

  handleCloseSnackbar() {
    this.setState({
      showSnackbar: false
    })
  }

  handleClick() {
    const { addScores } = this.props;
    const { code, scores } = this.state.player;
    addScores({ code: +code, scores: +scores });
    this.setState({
      player: {
        code: code,
        scores: ''
      }
    })
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
    const { found_player, updated_player } = this.props;
    const { player, idInputTouched } = this.state;

    const userFound = found_player && found_player.code > 0;

    let foundPlayerInfo = null;
    if (idInputTouched) {
      if (userFound) {
        foundPlayerInfo = (
          <Chip
            label={ `Пользователь: ${found_player.email} (${found_player.scores} баллов)` }
            color='primary'
            variant='outlined'
          />
        )
      } else {
        foundPlayerInfo = (
          <Chip
            label='Пользователь с указанным ID не существует'
            color='secondary'
            variant='outlined'
          />
        )
      }
    }

    return (
      <div>
        <MenuBar/>
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
            message={<span id='message-id'>Игрок с ID {updated_player && updated_player.code} успешно обновлён</span>}
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

                { foundPlayerInfo }

                <TextField
                  className='set-scores__input' type='text' label='Количество баллов'
                  variant='outlined' margin='dense'
                  value={ player.scores }
                  onChange={ this.handleChange('scores') }
                />

                <div className='set-scores__spacer'/>

                <Button disabled={!userFound || !player.scores} className='set-scores__input' onClick={::this.handleClick}  variant='contained' color='primary'>
                  Начислить
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  const { found_player, updated_player } = state.server;

  return {
    found_player,
    updated_player
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addScores: (player) => {
      dispatch({ type: 'server/add_scores', data: player });
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
