import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom'
import Registration from '../Registration'
import SetScores from '../SetScores'
import SetTournamentNumber from '../SetTournamentNumber'

export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <Switch>
          <Route exact path='/registration' component={ Registration } />
          <Route exact path='/game' component={ SetScores } />
          <Route exact path='/settournament' component={ SetTournamentNumber } />
        </Switch>
      </div>
    )
  }
}
