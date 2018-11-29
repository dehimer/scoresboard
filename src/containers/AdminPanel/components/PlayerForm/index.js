import { TextField } from '@material-ui/core';
import React from 'react';

import './index.scss'

export default ({ onChangeHandler, player }) => (
  <React.Fragment>
    <TextField
      disabled={true}
      className='player__input' type='text' label='RFID'
      variant='outlined' margin='dense'
      value={ player.rfid }
      onChange={ onChangeHandler('rfid') }
    />
    <TextField
      className='player__input' type='text' label='Имя'
      variant='outlined' margin='dense'
      value={ player.firstName }
      onChange={ onChangeHandler('firstName') }
    />
    <TextField
      className='player__input' type='date' label='Фамилия'
      variant='outlined' margin='dense'
      value={ player.lastName }
      onChange={ onChangeHandler('lastName') }
    />
    <TextField
      className='player__input' type='email' label='Потрачено'
      variant='outlined' margin='dense'
      value={ player.spend }
      onChange={ onChangeHandler('spend') }
    />
    <TextField
      className='player__input' type='phone' label='Осталось'
      variant='outlined' margin='dense'
      value={ player.balance }
      onChange={ onChangeHandler('balance') }
    />
    <TextField
      className='player__input' type='phone' label='Изначально'
      variant='outlined' margin='dense'
      value={ player.startBalance }
      onChange={ onChangeHandler('startBalance') }
    />
  </React.Fragment>
)
