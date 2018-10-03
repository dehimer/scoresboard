import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './assets/styles/index.scss'

import App from './containers/App';

const theme = createMuiTheme({
  typography: {
    fontSize: 18
  }
});


const store = configureStore();

render(
  <Provider store={store}>
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <App/>
      </MuiThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
