import { combineReducers } from 'redux'
import player from './player'
import colors from './colors'
import server from './server'

export const rootReducer = combineReducers({
  player,
  colors,
  server
})