import { combineReducers } from 'redux'
import player from './player'
import server from './server'

export const rootReducer = combineReducers({
  player,
  server
})