import React from 'react';
import './index.scss';

export default ({ children, lined, centerAlign, color }) => (
  <div className='input-wrapper'>
    { lined ? <div className='input-wrapper__line'/> : null }
    <div
      className={`input-wrapper__inner-border ${centerAlign ? 'center' : ''}`}
      style={ color ? {'background-color': color} : {}}>
      { children }
    </div>
  </div>
)
