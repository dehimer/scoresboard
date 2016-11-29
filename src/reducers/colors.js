import {
  GET_COLORS_REQUEST,
  GET_COLORS_SUCCESS,
  GET_COLORS_FAIL
} from '../constants/colors'

const initialState = {}

export default function colorsstate(state = initialState, action) {

  switch (action.type) {

    case GET_COLORS_REQUEST:
      // TODO
      console.log('GETCOLORS');
      return {}

    case GET_COLORS_SUCCESS:
      // TODO
      return {}

    case GET_COLORS_FAIL:
      // TODO
      return {}

    default:
      return state
    }
}