import { ADDBANNER, ADDPERSONALIZED } from '../constants/counter';

const INITIAL_STATE = {
  banner: [],
  personalized: []
};

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADDBANNER:
      // banners 数据
      return {
        ...state,
        banner: action.data
      };
    case ADDPERSONALIZED:
      // banners 数据
      return {
        ...state,
        personalized: action.data
      };
    default:
      return state;
  }
}
