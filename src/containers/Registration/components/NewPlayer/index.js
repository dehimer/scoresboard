import React from 'react';
import { Button, TextField, FormControlLabel, Switch } from '@material-ui/core'

import './index.scss'

export default (props) => {
  console.log(props);
  return (
    <form className='new-player'>
      <h3 className='new-player__header'>Не регистрировался на сайте</h3>
      <TextField className='new-player__input' type='text' label='Никнейм' variant='outlined' margin='dense'/>
      <TextField className='new-player__input' type='text' label='ФИО' variant='outlined' margin='dense'/>
      <TextField className='new-player__input' type='text' label='Дата рождения' variant='outlined' margin='dense'/>
      <TextField className='new-player__input' type='text' label='Город проживания' variant='outlined' margin='dense'/>
      <TextField className='new-player__input' type='email' label='E-mail' variant='outlined' margin='dense'/>
      <TextField className='new-player__input' type='phone' label='Телефон' variant='outlined' margin='dense'/>
      <TextField className='new-player__input' type='text' label='Ноутбук (марка и модель)' variant='outlined' margin='dense'/>
      <TextField className='new-player__input' type='text' label='Ссылка на страницу в соц. сетях' variant='outlined' margin='dense'/>
      <FormControlLabel className='new-player__input' control={<Switch/>} label='Принёс ноутбук' />

      <Button className='new-player__input' variant='contained' color='primary'>
        Зарегистрировать и показать ID
      </Button>
    </form>
  )
};
