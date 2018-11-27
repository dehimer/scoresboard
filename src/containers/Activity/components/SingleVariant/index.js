import React from 'react';
import InputWrapper from '../../../../components/InputWrapper';

import './index.scss';

export default ({ variant }) => (
  <div className='single-variant'>
    <div className='question'>{Array.isArray(variant.text) ? variant.text.map(text => <div>{text}</div>) : variant.text}</div>
    <div className='accept'>
      <InputWrapper lined={true} centerAlign={variant.hiddenPrice}>
        Да
      </InputWrapper>
    </div>
  </div>
)
