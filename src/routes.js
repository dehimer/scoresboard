import React from 'react';
import { Route } from 'react-router';

import App from './containers/App';
import Registration from './containers/Registration'

export const routes = (
  <div>
    <Route path='/' component={App}>
      <Route path='registration' component={Registration} />
    </Route>
    <Route path='*' component={App} />
  </div>
);
