import React from 'react';
import './index.scss';

export default ({ children, lined, centerAlign }) => {
  return (
    <div className='input-wrapper'>
      { lined ? <div className='input-wrapper__line'/> : null }
      <div className={`input-wrapper__inner-border ${centerAlign ? 'center' : ''}`}>
        { children }
      </div>
    </div>
  )
}
