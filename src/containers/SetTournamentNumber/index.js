import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, Card, CardContent, TextField, Snackbar } from '@material-ui/core';

import './index.scss'
import MenuBar from '../../components/MenuBar';

class SetTournamentNumber extends Component {
  state = {
    inputTouched: false,
    tournamentNumber: 0,
    showSnackbar: false
  };

  handleCloseSnackbar() {
    this.setState({
      showSnackbar: false
    })
  }

  handleClick() {
    const { setTournamentNumber } = this.props;
    const { tournamentNumber } = this.state;
    setTournamentNumber(tournamentNumber);
  }

  handleChange(event) {
    const value = event.target.value * 1;
    this.setState({
      inputTouched: true,
      tournamentNumber: value
    });
  }

  componentWillReceiveProps(nextProps) {
    const { tournament_number: tournament_number_prev } = this.props;
    const { tournament_number: tournament_number_next } = nextProps;
    const tournament_number_changed = !isNaN(+tournament_number_next) && tournament_number_next !== tournament_number_prev;

    if (tournament_number_changed) {
      this.setState({
        showSnackbar: this.state.inputTouched,
        tournamentNumber: tournament_number_next
      })
    }
  }

  componentDidMount() {
    const { tournament_number } = this.props;
    if (typeof tournament_number !== 'undefined'){
      this.setState({
        tournamentNumber: tournament_number
      })
    } else {
      this.props.getTournamentNumber();
    }
  }

  render() {
    const { inputTouched, tournamentNumber } = this.state;

    return (
      <div>
        <MenuBar/>
        <div className='set-tournament-number-wrapper'>
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
            message={<span id='message-id'>Номер турнира успешно обновлён</span>}
          />
          <Card>
            <CardContent>
              <form className='set-tournament-number'>
                <h3 className='set-tournament-number__header'>Установка номера турнира</h3>

                <TextField
                  className='set-tournament-number__input' type='text' label='Номер турнира'
                  variant='outlined' margin='dense'
                  value={ tournamentNumber }
                  onChange={ ::this.handleChange }
                />

                <div className='set-tournament-number__spacer'/>

                <Button disabled={!inputTouched || !tournamentNumber || tournamentNumber === this.props.tournament_number} className='set-tournament-number__input' onClick={::this.handleClick}  variant='contained' color='primary'>
                  Установить
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
  const { tournament_number } = state.server;

  return {
    tournament_number
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTournamentNumber: (tournamentNumber) => {
      dispatch({ type: 'server/set_tournament_number', data: tournamentNumber });
    },
    getTournamentNumber: () => {
      dispatch({ type: 'server/get_tournament_number' });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetTournamentNumber);
