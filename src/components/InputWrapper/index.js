import React from 'react';
import './index.scss';

export default ({ children, lined }) => {
  return (
    <div className='input-wrapper'>
      { lined ? <div className='input-wrapper__line'/> : null }
      <div className='input-wrapper__inner-border'>
        { children }
      </div>
    </div>
  )
}
