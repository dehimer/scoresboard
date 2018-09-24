import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { rootReducer } from '../reducers'

import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
let socket = io(`http://${location.host}`);
let socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

export default function configureStore() {
  const store = compose(
    applyMiddleware(socketIoMiddleware),
    applyMiddleware(thunkMiddleware),
    applyMiddleware(createLogger())
  )(createStore)(rootReducer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').rootReducer)
    });
  }

  return store
}
