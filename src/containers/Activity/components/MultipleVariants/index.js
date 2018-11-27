import React from 'react';
import InputWrapper from '../../../../components/InputWrapper';

import './index.scss';

export default ({ variants, currency }) => (
  <div className='multiple-variants'>
    {
      variants.map((variant, idx) => {
        return (
          <div key={idx} className='variant'>
            <InputWrapper lined={true}>
              <div className='text'>
                {variant.text}
              </div>
              <div className=''>
                <div>
                  {variant.price}
                  {currency}
                </div>
              </div>
            </InputWrapper>
          </div>
        )
      })
    }
  </div>
)
