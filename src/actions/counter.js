import {
  USERINFO
} from '../constants/counter'

export const userInfo = (val) => {
  return {
    type: USERINFO,
    data: val
  }
}
// 异步的action
export function asyncAdd () {
  return dispatch => {
    setTimeout(() => {
      dispatch(add())
    }, 2000)
  }
}
