import React from 'react';
import {Button, TextField} from '@material-ui/core';

import './index.scss'

export default (props) => {
  console.log(props);
  return (
    <form className='registered-player'>
      <h3 className='registered-player__header'>Регистрировался на сайте / получить ID</h3>
      <TextField className='registered-player__input' type='email' label='E-mail' variant='outlined' margin='dense'/>
      <div className='registered-player__input_spacer'/>
      <Button className='registered-player__input' variant='contained' color='primary'>
        Показать ID
      </Button>
    </form>
  )
};
