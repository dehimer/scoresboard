import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom'
import Registration from '../Registration'
import SetScores from '../SetScores'
import SetTournamentNumber from '../SetTournamentNumber'
import AdminPanel from '../AdminPanel'
import Top10Table from '../../components/Top10Table'
import FullTable from '../../components/FullTable'

export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <Switch>
          <Route exact path='/registration' component={ Registration } />
          <Route exact path='/game' component={ SetScores } />
          <Route exact path='/settournament' component={ SetTournamentNumber } />
          <Route exact path='/adminpanel' component={ AdminPanel } />
          <Route exact path='/table' component={ Top10Table } />
          <Route exact path='/table-full' component={ FullTable } />
        </Switch>
      </div>
    )
  }
}
