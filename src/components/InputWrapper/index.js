import React from 'react';
import './index.scss';

export default ({ children }) => {
  return (
    <div className='input-wrapper'>
      <div className='input-wrapper__inner-border'>
        { children }
      </div>
    </div>
  )
}
