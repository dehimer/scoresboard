import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Registration from '../Registration'
/*
import SetScores from '../SetScores'
import AdminPanel from '../AdminPanel'
import Top10Table from '../../components/Top10Table'
import FullTable from '../../components/FullTable'
*/

export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <Switch>
          <Route exact path='/registration' component={ Registration } />
          {/*<Route exact path='/activity' component={ SetScores } />*/}
          {/*<Route exact path='/adminpanel' component={ AdminPanel } />*/}
          {/*<Route exact path='/table-5' component={ Top10Table } />*/}
          {/*<Route exact path='/table-10' component={ FullTable } />*/}
        </Switch>
      </div>
    )
  }
}
