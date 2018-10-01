import React, { Component } from 'react';
import { Button, CardContent, Card } from '@material-ui/core'
import PlayerForm from '../../../../components/PlayerForm'

import './index.scss'

export default class NewPlayer extends Component {
  requiredFields = ['nickname', 'fullname', 'birthday', 'city', 'phone', 'email'];

  state = {
    nickname: '',
    fullname: '',
    birthday: '',
    city: '',
    email: '',
    phone: '',
    notebook: '',
    link: '',
    broughtNotebook: false
  };
  handleClick() {
    const { register } = this.props;
    register({ ...this.state });
  }

  handleChange = name => event => {
    const value = (name === 'broughtNotebook') ? event.target.checked : event.target.value;

    this.setState({
      [name]: value
    });
  };

  render() {
    const disabled = Object.keys(this.state).some(fieldName => (this.requiredFields[fieldName] && !this.state[fieldName]));

    return (
      <Card>
        <CardContent>
          <form className='new-player'>
            <h3 className='new-player__header'>Не регистрировался на сайте</h3>

            <PlayerForm onChangeHandler={::this.handleChange} player={this.state}/>

            <Button disabled={disabled} className='new-player__input' onClick={::this.handleClick} variant='contained' color='primary'>
              Зарегистрировать и показать ID
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }
}

