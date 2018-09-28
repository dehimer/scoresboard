import React from 'react';

import './index.scss'

export default (props) => {
  console.log(props);
  return (
    <form className='new-player'>
      <h3 className='new-player__header'>Не регистрировался на сайте</h3>
      <input className='new-player__input' type='text' placeholder='Никнейм'/>
      <input className='new-player__input' type='text' placeholder='ФИО'/>
      <input className='new-player__input' type='text' placeholder='Дата рождения'/>
      <input className='new-player__input' type='text' placeholder='Город проживания'/>
      <input className='new-player__input' type='email' placeholder='E-mail'/>
      <input className='new-player__input' type='phone' placeholder='Телефон'/>
      <input className='new-player__input' type='text' placeholder='Ноутбук (марка и модель)'/>
      <input className='new-player__input' type='text' placeholder='Ссылка на страницу в соц. сетях'/>
      <div className='new-player__input' >
        <input type='checkbox'/>Принёс ноутбук
      </div>
      <input className='new-player__input' type='button' value='Зарегистрировать и показать ID'/>
    </form>
  )
};
