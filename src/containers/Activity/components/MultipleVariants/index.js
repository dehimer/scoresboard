import React from 'react';
import InputWrapper from '../../../../components/InputWrapper';
import dottedPrice from '../../../../utils/dottedPrice'

import './index.scss';

export default ({ variants, currency, select }) => (
  <div className='multiple-variants'>
    {
      variants.map((variant, idx) => (
        <div key={idx} className='variant' onClick={() => select(variant)}>
          <InputWrapper lined={true} centerAlign={variant.hiddenPrice}>
            <div className='text'>
              {variant.text}
            </div>
            {
              variant.hiddenPrice ? null : (
                <div>
                  {dottedPrice(variant.price)}
                  {currency}
                </div>
              )
            }
          </InputWrapper>
        </div>
      ))
    }
  </div>
)
