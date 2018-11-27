import React, { Component } from 'react';
import { connect } from 'react-redux'

import './index.scss'
import { Button, Card, CardContent, TextField, Typography, CircularProgress } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    fontSize: 100
  }
});

const emptyPlayer = { firstName: '', lastName: '' };

class Registration extends Component {
  state = {
    player: {
      ...emptyPlayer
    }
  };

  submit() {
    const { updatePoint, match: { params: { id } } } = this.props;
    const { player } = this.state;

    updatePoint({ id, payload: { player } });
    this.resetPlayerFields();
  }

  cancel() {
    const { updatePoint, match: { params: { id } } } = this.props;
    updatePoint({ id, payload: { player: null } });
    this.resetPlayerFields();
  }

  resetPlayerFields() {
    this.setState({
      player: {
        ...emptyPlayer
      }
    })
  }

  handleChange = name => event => {
    const value = event.target.value;
    const { player } = this.state;

    this.setState({
      player: { ...player, [name]: value }
    });
  };

  render() {
    const { registrationPoints, match: { params: { id } } } = this.props;
    const registrationPoint = registrationPoints && registrationPoints[id];

    const { player } = this.state;
    const { firstName, lastName } = player;


    let content = null;

    if(!registrationPoints) {
      content = ( <CircularProgress size={50} />)
    } else if (!registrationPoint) {
      content = (
        <Typography color='textSecondary' variant='display4'>
          Неверный номер точки регистрации
        </Typography>
      )
    } else if (registrationPoint.error) {
      content = (
        <Typography color='textSecondary' variant='display4'>
          {registrationPoint.error === 'rfidInUse' ? 'Карта уже зарегистрирована' : 'Неизвестная ошибка. Просим прощения...'}
        </Typography>
      )
    } else if (registrationPoint.registered) {
      content = (
        <Typography color='textSecondary' variant='display4'>
          Поздравляем! Регистрация прошла успешно.
        </Typography>
      )
    } else if (registrationPoint.player) {
      content = (
        <div className='registration__rfid-waiting'>
          <Typography color='textSecondary' variant='display4'>
            Поднесите карту к считывателю
          </Typography>

          <br/>
          <br/>
          <br/>
          <br/>

          <MuiThemeProvider theme={theme}>
            <Button className='registration__rfid-waiting-button' onClick={::this.cancel}>
              Отмена
            </Button>
          </MuiThemeProvider>
        </div>
      )
    } else {
      content = (
        <Card>
          <CardContent>
            <Typography color='textSecondary' variant='display2'>
              Регистрация
            </Typography>
            <form>
              <MuiThemeProvider theme={theme}>
                <TextField
                  type='text' placeholder='Имя'
                  variant='outlined' margin='dense'
                  value={ firstName }
                  onChange={ this.handleChange('firstName') }
                />
                <TextField
                  type='text' placeholder='Фамилия'
                  variant='outlined' margin='dense'
                  value={ lastName }
                  onChange={ this.handleChange('lastName') }
                />

                <br/>

                <Button disabled={!firstName || !lastName} onClick={::this.submit} variant='contained' color='primary'>
                  Зарегистрироваться
                </Button>
              </MuiThemeProvider>
            </form>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className='registration'>
        { content }
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  const { registrationPoints } = state.server;

  return { registrationPoints };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePoint: (data) => {
      dispatch({ type: 'server/registration_point_update', data });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration);
