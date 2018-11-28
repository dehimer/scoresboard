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
      <Fragment>
        <div>Было {startBalance}{currency}, стало {balance}{currency}</div>
        <div>NO MONEY, NO HONEY!</div>
      </Fragment>
    )
  }
  </div>
)
