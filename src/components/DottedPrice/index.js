import React, { Fragment } from 'react';

export default ({ children }) => (
  <Fragment>
      { children.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') }
  </Fragment>
)
