import React, { Component } from 'react';
import { connect } from 'react-redux'

import './index.scss'

import Logo from '../../components/Logo';
import { CircularProgress } from '@material-ui/core';
import InputWrapper from '../../components/InputWrapper';

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
        <div className='message'>
          Неверный номер точки регистрации
        </div>
      )
    } else if (registrationPoint.error) {
      content = (
        <div className='message'>
          {registrationPoint.error === 'rfidInUse' ? 'Карта уже зарегистрирована' : 'Неизвестная ошибка. Просим прощения...'}
        </div>
      )
    } else if (registrationPoint.registered) {
      content = (
        <div className='message'>
          Поздравляем! Регистрация прошла успешно.
        </div>
      )
    } else if (registrationPoint.player) {
      content = (
        <div className='registration__rfid-waiting'>
          <div className='note'>
            Поднесите карту к считывателю
          </div>

          <div className='cancel' disabled={!firstName || !lastName} onClick={::this.cancel}>
            <InputWrapper lined={true} centerAlign={true}>
              Отмена
            </InputWrapper>
          </div>
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
            <InputWrapper lined={true} centerAlign={true}>
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
