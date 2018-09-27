import React from 'react'
import { Route } from 'react-router'

import App from './containers/App'

export const routes = (
  <div>
    <Route path='/' component={App}>
    </Route>
    <Route path='*' component={App} />
  </div>
);
