import React from 'react';

import './index.scss'
import InputWrapper from '../../../../components/InputWrapper';

export default ({ selected, reset }) => (
  <div className='rfid-waiting'>
    <div className='question'>
      {selected.text}
    </div>
    <div className='action'>
      <InputWrapper lined={true} centerAlign={true}>
        Для оплаты поднесите карту
      </InputWrapper>
    </div>
    <div className='back' onClick={reset}>Назад</div>
  </div>
)
