import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { routes } from './routes'

import { Router, browserHistory } from 'react-router'

import { Provider } from 'react-redux'
import configureStore from './store/configureStore'


const store = configureStore();

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('root')
)
