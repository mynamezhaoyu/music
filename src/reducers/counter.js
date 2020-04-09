import { ADDBANNER } from '../constants/counter';

const INITIAL_STATE = {
  banner: []
};

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADDBANNER:
      // banners 数据
      return {
        ...state,
        banner: action.data
      };
    default:
      return state;
  }
}
