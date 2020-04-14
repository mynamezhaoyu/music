import { ADDBANNER, ADDPERSONALIZED, ADDPLAYLIST, ADDSONGURL, ADDPLAYNUM } from '../constants/counter';
const INITIAL_STATE = {
  banner: [], // banners 数据
  personalized: [], // 推荐歌单 数据
  playList: [], // 点击歌单数据
  songUrl: [], // 详细歌单url数据
  playnum: 0 // 当前播放
};

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADDBANNER:
      return {
        ...state,
        banner: action.data
      };
    case ADDPERSONALIZED:
      return {
        ...state,
        personalized: action.data
      };
    case ADDPLAYLIST:
      return {
        ...state,
        playList: action.data
      };
    case ADDSONGURL:
      return {
        ...state,
        songUrl: action.data
      };
    case ADDPLAYNUM:
      return {
        ...state,
        playnum: action.data
      };
    default:
      return state;
  }
}
