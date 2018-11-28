import React from 'react';

import './index.scss';

export default ({ text, currency, player }) => (
  <div className='balance-checking'>
    {
      player ? (
        <div className='balance-info'>
          <div className='greeting'>{player.firstName}, приветствуем вас в конце Вселенной!</div>
          <div className='balance-label'>На вашем счету:</div>
          <div className='balance'>{player.balance}{currency}</div>
        </div>
      ) : (
        <div className='asking'>{text}</div>
      )
    }
  </div>
)
