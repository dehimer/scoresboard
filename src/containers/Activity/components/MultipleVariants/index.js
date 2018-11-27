import React from 'react';

import './index.scss';

export default ({ variants, currency }) => (
  <div className='multiple-variants'>
    {
      variants.map((variant, idx) => (
        <div key={idx} className='variant'>
          <div>
            {variant.text}
          </div>
          <div>
            {variant.price}
            {currency}
          </div>

        </div>
      ))
    }
  </div>
)
