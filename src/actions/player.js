/* eslint-disable no-unused-vars */
import {
  ADD_PLAYER_REQUEST,
  ADD_PLAYER_FAIL,
  ADD_PLAYER_SUCCESS
} from '../constants/player'


export function add(payload) {
  return {
    type: ADD_PLAYER_REQUEST
  }
}

/* eslint-enable no-unused-vars */