import React, { Fragment } from 'react';

import './index.scss'
import InputWrapper from '../../../../components/InputWrapper';

export default ({ selected, customMsg, reset }) => (
  <div className='rfid-waiting'>
    {
      customMsg ? (
        customMsg.map((msg, idx) => (
          <div className='custom-question' key={idx}>{msg.replace('[variant]', `"${ selected.text }"`)}</div>
        ))
      ) : (
        <Fragment>
          <div className='question'>
            { selected.text }
          </div>
          <div className='action'>
            <InputWrapper lined={true} centerAlign={true}>
              Для оплаты поднесите карту
            </InputWrapper>
          </div>
        </Fragment>
      )
    }
    <div className='back' onClick={reset}>Назад</div>
  </div>
)
