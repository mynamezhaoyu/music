import {
  ADDBANNER
} from '../constants/counter'

export const addBanner = (val) => {
  return {
    type: ADDBANNER,
    data: val
  }
}