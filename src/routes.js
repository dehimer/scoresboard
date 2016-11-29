import React from 'react'
import { Route, IndexRedirect } from 'react-router'

import App from './containers/App'
import Admin from './layouts/Admin'
import ScoreBoard from './containers/ScoreBoard'
import ScreenSaver from './components/ScreenSaver'
import AddPlayer from './containers/AddPlayer'
import PlayersList from './containers/PlayersList'

export const routes = (
  <div>
    <Route path='/' component={App}>
      <IndexRedirect to='scoreboard' />
      <Route path='admin' component={Admin}>
        <IndexRedirect to='playerslist' />
        <Route path='addplayer' component={AddPlayer} />
        <Route path='playerslist' component={PlayersList} />	
      </Route>
      <Route path='scoreboard' component={ScoreBoard} />
      <Route path='screensaver' component={ScreenSaver} />
    </Route>
    <Route path='*' component={App} />
  </div>
)