import React, { Fragment } from 'react';
import DottedPrice from '../../../../components/DottedPrice'

import './index.scss'

export default ({ currency, player: { firstName, balance, spend, startBalance } }) => (
  <div className='payment-result'>
  {
    balance > 0 ? (
      <Fragment>
        <div>{firstName}, благодарим за покупку!</div>
        <div>С вашео счёта было списано: <DottedPrice>{spend}</DottedPrice>{currency}</div>
        <div>Баланс после списания: <span className='balance'><DottedPrice>{balance}</DottedPrice>{currency}</span></div>
        <div>Здесь всегда рады вам!</div>
      </Fragment>
    ) : (
      <div className='empty-balance'>
        <div>{firstName}! Поздравляем!</div>
        <div className='marginized'>
          <div>Вы потратили все <DottedPrice>{startBalance}</DottedPrice>{currency}.</div>
          <div>Теперь для вас всё бесплатно!</div>
        </div>
      </div>
    )
  }
  </div>
)
