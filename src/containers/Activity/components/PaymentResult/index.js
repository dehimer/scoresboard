import React, { Fragment } from 'react';
import dottedPrice from '../../../../utils/dottedPrice'

import './index.scss'

export default ({
  currency,
  response,
  player: { firstName, balance, spend, startBalance },
  selected: { price }
}) => (
  <div className={`payment-result ${response ? 'custom' : ''}`}>
  {
    balance > 0 ? (
      <Fragment>
      {
        response ? (
          <Fragment>
            {
              response.map(msg => (
                <div>
                  {
                    msg === '[spend]' ? (
                      <div>
                        <div>С вашего счета было списано:</div>
                        <div className='big-text'>{dottedPrice(spend)}{currency}</div>
                      </div>
                    ) : msg === '[balance]' ? (
                      <div>
                        <div>На вашем счету:</div>
                        <div className='balance'>{dottedPrice(balance)}{currency}</div>
                      </div>
                    ) : msg
                      .replace('[name]', firstName)
                      .replace('[price]', dottedPrice(price))
                      .replace('[currency]', currency)
                  }
                </div>
              ))
            }
          </Fragment>
        ) : (
          <Fragment>
            <div>{firstName}, благодарим за покупку!</div>
            <div>С вашео счёта было списано: {dottedPrice(spend)}{currency}</div>
            <div>Баланс после списания: <span className='balance'>{dottedPrice(balance)}{currency}</span></div>
            <div>Здесь всегда рады вам!</div>
          </Fragment>
        )
      }
      </Fragment>
    ) : (
      <div className='empty-balance'>
        <div>{firstName}! Поздравляем!</div>
        <div className='marginized'>
          <div>Вы потратили все {dottedPrice(startBalance)}{currency}.</div>
          <div>Теперь для вас всё бесплатно!</div>
        </div>
      </div>
    )
  }
  </div>
)
