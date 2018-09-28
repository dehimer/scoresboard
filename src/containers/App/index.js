import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom';
import Registration from '../Registration';

export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <Switch>
          <Route exact path='/registration' component={Registration} />
        </Switch>
      </div>
    )
  }
}
