import {
  ADD_PLAYER_REQUEST,
  ADD_PLAYER_FAIL,
  ADD_PLAYER_SUCCESS
} from '../constants/player'

const initialState = {}

export default function playerstate(state = initialState, action) {

  switch (action.type) {

    case ADD_PLAYER_REQUEST:
      // TODO
      return {}

    case ADD_PLAYER_FAIL:
      // TODO
      return {}

    case ADD_PLAYER_SUCCESS:
      // TODO
      return {}

    default:
      return state
    }
}