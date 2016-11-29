/* eslint-disable no-unused-vars */
import {
  GET_COLORS_REQUEST,
  GET_COLORS_FAIL,
  GET_COLORS_SUCCESS
} from 'constants/colors'


export function get(payload) {
  return {
    type: GET_COLORS_REQUEST
  }
}

/* eslint-enable no-unused-vars */