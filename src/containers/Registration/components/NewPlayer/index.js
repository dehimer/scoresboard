import React, { Component } from 'react';
import { Button, TextField, FormControlLabel, Switch } from '@material-ui/core'

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
      <form className='new-player'>
        <h3 className='new-player__header'>Не регистрировался на сайте</h3>
        <TextField
          className='new-player__input' type='text' label='Никнейм'
          variant='outlined' margin='dense'
          value={this.state.nickname}
          onChange={this.handleChange('nickname')}
        />
        <TextField
          className='new-player__input' type='text' label='ФИО'
          variant='outlined' margin='dense'
          value={this.state.fullname}
          onChange={this.handleChange('fullname')}
        />
        <TextField
          className='new-player__input' type='date' label='Дата рождения'
          variant='outlined' margin='dense'
          InputLabelProps={{
            shrink: true
          }}
          value={this.state.birthday}
          onChange={this.handleChange('birthday')}
        />
        <TextField
          className='new-player__input' type='text' label='Город проживания'
          variant='outlined' margin='dense'
          value={this.state.city}
          onChange={this.handleChange('city')}
        />
        <TextField
          className='new-player__input' type='email' label='E-mail'
          variant='outlined' margin='dense'
          value={this.state.email}
          onChange={this.handleChange('email')}
        />
        <TextField
          className='new-player__input' type='phone' label='Телефон'
          variant='outlined' margin='dense'
          value={this.state.phone}
          onChange={this.handleChange('phone')}
        />
        <TextField
          className='new-player__input' type='text' label='Ноутбук (марка и модель)'
          variant='outlined' margin='dense'
          value={this.state.notebook}
          onChange={this.handleChange('notebook')}
        />
        <TextField
          className='new-player__input' type='text' label='Ссылка на страницу в соц. сетях'
          variant='outlined' margin='dense'
          value={this.state.link}
          onChange={this.handleChange('link')}
        />
        <FormControlLabel
          className='new-player__input'
          control={
            <Switch checked={this.state.broughtNotebook} value='broughtNotebook' onChange={::this.handleChange('broughtNotebook')}/>
          }
          label='Принёс ноутбук'
        />

        <Button disabled={disabled} className='new-player__input' onClick={::this.handleClick} variant='contained' color='primary'>
          Зарегистрировать и показать ID
        </Button>
      </form>
    )
  }
}

