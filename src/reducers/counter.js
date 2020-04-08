import { USERINFO } from '../constants/counter'

const INITIAL_STATE = {
  userInfo: 0
}

export default function counter (state = INITIAL_STATE, action) {
  switch (action.type) {
    case USERINFO:
      return {
        ...state,
        userInfo: action.data
      }
     default:
       return state
  }
}
