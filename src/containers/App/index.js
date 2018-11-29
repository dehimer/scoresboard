import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import Registration from '../Registration'
import Activity from '../Activity'
import TopTen from '../TopTen';
import AdminPanel from '../AdminPanel'

export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <Switch>
          <Route exact path='/registration_point/:id' component={ Registration } />
          <Route exact path='/activity/:id' component={ Activity } />
          <Route exact path='/topten' component={ TopTen } />
          <Route exact path='/adminpanel' component={ AdminPanel } />
        </Switch>
      </div>
    )
  }
}
