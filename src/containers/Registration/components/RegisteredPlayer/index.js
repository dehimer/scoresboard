import React, { Component } from 'react';
import {Button, Card, CardContent, FormControlLabel, Switch, TextField} from '@material-ui/core';

import './index.scss'

export default class RegisteredPlayer extends Component {
  state = {
    email: '',
    broughtNotebook: false
  };

  handleClick() {
    const { checkId } = this.props;
    checkId({ ...this.state });
  }

  handleChange = name => event => {
    this.setState({
      [name]: (name === 'broughtNotebook') ? event.target.checked : event.target.value
    });
  };

  render() {
    const disabled = Object.keys(this.state).some(fieldName => (fieldName !== 'broughtNotebook' && !this.state[fieldName]));

    return (
      <Card>
        <CardContent>
          <form className='registered-player'>
            <h3 className='registered-player__header'>Регистрировался на сайте / получить ID</h3>
            <TextField
              className='new-player__input' type='email' label='E-mail'
              variant='outlined' margin='dense'
              value={this.state.email}
              onChange={this.handleChange('email')}
            />
            <FormControlLabel
              className='new-player__input'
              control={
                <Switch checked={this.state.broughtNotebook} value='broughtNotebook' onChange={this.handleChange('broughtNotebook')}/>
              }
              label='Принёс ноутбук'
            />
            <Button disabled={disabled} className='registered-player__input' onClick={::this.handleClick}  variant='contained' color='primary'>
              Показать ID
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }
}
