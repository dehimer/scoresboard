import { FormControlLabel, Switch, TextField } from '@material-ui/core';
import React from 'react';

import './index.scss'

export default ({ onChangeHandler, player }) => (
  <React.Fragment>
    <TextField
      className='player__input' type='text' label='Никнейм'
      variant='outlined' margin='dense'
      value={ player.nickname }
      onChange={ onChangeHandler('nickname') }
    />
    <TextField
      className='player__input' type='text' label='ФИО'
      variant='outlined' margin='dense'
      value={ player.fullname }
      onChange={ onChangeHandler('fullname') }
    />
    <TextField
      className='player__input' type='date' label='Дата рождения'
      variant='outlined' margin='dense'
      InputLabelProps={{
        shrink: true
      }}
      value={ player.birthday }
      onChange={ onChangeHandler('birthday') }
    />
    <TextField
      className='player__input' type='text' label='Город проживания'
      variant='outlined' margin='dense'
      value={player.city}
      onChange={ onChangeHandler('city') }
    />
    <TextField
      className='player__input' type='email' label='E-mail'
      variant='outlined' margin='dense'
      value={ player.email }
      onChange={ onChangeHandler('email') }
    />
    <TextField
      className='player__input' type='phone' label='Телефон'
      variant='outlined' margin='dense'
      value={ player.phone }
      onChange={ onChangeHandler('phone') }
    />
    <TextField
      className='player__input' type='text' label='Ноутбук (марка и модель)'
      variant='outlined' margin='dense'
      value={ player.notebook }
      onChange={ onChangeHandler('notebook') }
    />
    <TextField
      className='new-player__input' type='text' label='Ссылка на страницу в соц. сетях'
      variant='outlined' margin='dense'
      value={ player.link }
      onChange={ onChangeHandler('link') }
    />
    <FormControlLabel
      className='new-player__input'
      control={
        <Switch checked={player.broughtNotebook} value='broughtNotebook' onChange={onChangeHandler('broughtNotebook')}/>
      }
      label='Принёс ноутбук'
    />
  </React.Fragment>
)
