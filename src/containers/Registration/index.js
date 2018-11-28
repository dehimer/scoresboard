import React, { Component } from 'react';
import { connect } from 'react-redux'

import './index.scss'

import Logo from '../../components/Logo';
import { Button, Typography, CircularProgress } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import InputWrapper from '../../components/InputWrapper';

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
        <form>
          <div class='inputs'>
            <div className='input'>
              <InputWrapper>
                <input
                  type='text' placeholder='Имя:'
                  variant='outlined' margin='dense'
                  value={ firstName }
                  onChange={ this.handleChange('firstName') }
                />
              </InputWrapper>
            </div>

            <div className='input'>
              <InputWrapper>
                <input
                  type='text' placeholder='Фамилия:'
                  variant='outlined' margin='dense'
                  value={ lastName }
                  onChange={ this.handleChange('lastName') }
                />
              </InputWrapper>
            </div>
          </div>

          <br/>

          <div className='submit' disabled={!firstName || !lastName} onClick={::this.submit}>
            <InputWrapper lined={true}>
              Зарегистрироваться
            </InputWrapper>
          </div>
        </form>
      )
    }

    return (
      <div className='registration'>
        <Logo/>
        <div className='content'>
          { content }
        </div>
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
