import React from 'react';

import './index.scss';

export default ({ variant, currency}) => (
  <div className='single-variant'>
    <div>SINGLE VARIANT</div>
    <div>{variant.text}</div>
    <div>{currency}</div>
  </div>
)
