import Taro from "@tarojs/taro";
const INITIAL_STATE = {
  banner: [], // banners 数据
  personalized: [], // 推荐歌单 数据
  playList: [], // 当前播放列表(独立于歌单)
  songList: [], // 歌单数据
  playNum: 0, // 当前播放
  audioContext:
    process.env.TARO_ENV === "weapp"
      ? Taro.getBackgroundAudioManager()
      : Taro.createInnerAudioContext(), // 背景音乐实例
  musicType: true // 播放状态（开始，停止）
};

export default function counter(state = INITIAL_STATE, action) {
  let fn = [
    {
      name: "addBanner",
      fn: () => {
        return {
          ...state,
          banner: action.data
        };
      }
    },
    {
      name: "addPersonalized",
      fn: () => {
        return {
          ...state,
          personalized: action.data
        };
      }
    },
    {
      name: "addPlayList", // 点击歌单专用，当前播放列表变成歌单数据
      fn: () => {
        Object.assign(state.playList, action.data);
        return state;
      }
    },
    {
      name: "updateSongList",
      fn: () => {
        return {
          ...state,
          songList: action.data
        };
      }
    },
    {
      name: "addPlayNum",
      fn: () => {
        return {
          ...state,
          playNum: action.data
        };
      }
    },
    {
      name: "updateAudioContext",
      fn: () => {
        Object.assign(state.audioContext, action.data);
        return state;
      }
    },
    {
      name: "updateMusicType",
      fn: () => {
        return {
          ...state,
          musicType: action.data
        };
      }
    }
  ];
  let data = fn.filter(r => r.name === action.type);
  if (data.length) {
    return data[0].fn();
  }
  return state;
}
