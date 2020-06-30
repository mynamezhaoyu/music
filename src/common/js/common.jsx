import http from "../../services/api";
import Taro from "@tarojs/taro";
let obj = {
  isAir(obj, str) {
    // 看值会不是为空，但是taro这边编译的有问题。我在调用的时候，强行给我加了！取反
    let isError = false;
    if (obj === null) isError = false;
    if (typeof obj === "object") {
      isError = Array.isArray(obj) ? obj.length : Object.keys(obj).length;
    } else {
      isError = obj;
    }
    isError = isError ? obj : false;
    if (!isError) {
      // 如果是错误 直接返回
      return false;
    } else if (isError && str) {
      // 如果是真，并且有字符串的话
      return this.isAir(obj[str]);
    }
    return isError;
  },
  async play(id) {
    // 先拿歌单详情
    let data = await http.get("playlist/detail", {
      id: id,
      timestamp: new Date()
    });
    let arr = data.data.playlist.tracks; // 歌单详情里面已经给出前20条数据 但是不包含url地址
    let arr2 = data.data.playlist.trackIds; // 歌单的全部id
    let url = await this.musicUrl(arr.map(r => r.id).join(",")); // 拿这20条带id的数据 去取url， 因为已经包含了name，图片信息，所以不需要单独在调用歌曲详情接口
    // 拿到前20条的url数据
    url.data.data.map(r => {
      let n = arr.findIndex(n => n.id === r.id); // 在20条数据中找到匹配的
      let _n = arr2.findIndex(n => n.id === r.id); // 在 全部id 中搜到匹配的
      arr2[_n] = { ...arr2[_n], ...arr[n], ...r }; // 数据合并
    });
    return [data.data, arr2];
  },
  // 这个接口拿到歌曲详情的信息（name, 图片等等）
  async musicDetail(arr) {
    return http.get("song/detail", {
      ids: arr,
      timestamp: new Date()
    });
  },
  // 这个接口拿到id的url
  async musicUrl(arr) {
    return http.get("song/url", {
      id: arr,
      timestamp: new Date()
    });
  },
  // 更新歌曲详情
  async update(index) {
    if (index) {
      await Taro.$store.dispatch({
        type: "addPlayNum",
        data: index
      });
    }
    let { playNum, musicType, playList } = Taro.$store.getState().counter;
    // 因为微信小程序具备后台播放的功能。所以配置的参数不同
    let [musicData, data] = [{}, playList[playNum]];
    if (process.env.TARO_ENV === "weapp") {
      let _obj = data;
      musicData = {
        title: _obj.name,
        epname: _obj.ar[0].name,
        singer: _obj.al.name,
        coverImgUrl: _obj.al.picUrl,
        src:
          data.url ||
          `https://music.163.com/song/media/outer/url?id=${data.id}.mp3`
      };
    } else {
      musicData = {
        autoplay: true,
        src:
          data.url ||
          `https://music.163.com/song/media/outer/url?id=${data.id}.mp3`
      };
    }
    await Taro.$store.dispatch({
      type: "updateAudioContext",
      data: musicData
    });
    if (!musicType) {
      await Taro.$store.dispatch({
        type: "updateMusicType",
        data: true
      });
    }
  },
  // 时间转换
  getTime(val) {
    let time = val / 60;
    let arr = [time - (time % 1), parseInt((time % 1) * 60)];
    return `${arr[0] < 10 ? "0" + arr[0] : arr[0]}: ${
      arr[1] < 10 ? "0" + arr[1] : arr[1]
    }`;
  },
  // 歌曲暂停
  musicPause() {
    let { audioContext } = Taro.$store.getState().counter;
    audioContext.pause();
    Taro.$store.dispatch({
      type: "updateMusicType",
      data: false
    });
  },
  // 开始
  musicPlay() {
    let { audioContext } = Taro.$store.getState().counter;
    audioContext.play();
    Taro.$store.dispatch({
      type: "updateMusicType",
      data: true
    });
  },
  // 上一首
  async up() {
    let { playNum, playList } = Taro.$store.getState().counter;
    let index = playNum - 1;
    // 重置
    if (index < 0) index = playList.length - 1;
    if (!this.isAir(playList[index], "url")) {
      // 如果没有url，用id请求数据
      let data = await this.httpDetUrl(playList[index].id);
      if (data[1][0].url) {
        // 如果请求回来还是没有url，那么证明这首歌，是收费或者是vip歌曲。直接进行下一首。
        this.update(index);
      } else {
        this.up();
      }
      return;
    }
    this.update(index);
  },
  // 下一首
  async down() {
    let { playNum, playList } = Taro.$store.getState().counter;
    let index = playNum + 1;
    // 重置
    if (index >= playList.length) {
      index = 0;
    }
    if (!this.isAir(playList[index], "url")) {
      // 如果没有url，用id请求数据
      let data = await this.httpDetUrl(playList[index].id);
      if (data[1][0].url) {
        // 如果请求回来还是没有url，那么证明这首歌，是收费或者是vip歌曲。直接进行下一首。
        this.update(index);
      } else {
        this.down();
      }
      return;
    }
    // 如果有url直接播放，如果错误了，单独处理。不再这么进行。
    this.update(index);
  },
  async httpDetUrl(arr, type = true) {
    arr = arr + "";
    let { playList } = Taro.$store.getState().counter;
    // 请求没有url的数据

    let [det, url] = [[], []];
    //
    if (type) {
      [det, url] = await Promise.all([
        this.musicDetail(arr),
        this.musicUrl(arr)
      ]);
      [det, url] = [det.data.songs, url.data.data];
    } else {
      det = await this.musicDetail(arr);
      det = det.data.songs;
    }
    arr.split(",").map(r => {
      r = Number(r);
      let [tDet, tUrl, tPlayList, tPlayListIndex] = [
        // 找到对应id的详情，找对对象Id的url数据，找到原先没有URl的数据，找到原先播放列表数据的位置
        det.filter(n => n.id === r)[0],
        url.filter(n => n.id === r)[0],
        playList.filter(n => n.id === r)[0],
        playList.findIndex(n => n.id === r)
      ];
      playList[tPlayListIndex] = { ...{}, ...tPlayList, ...tDet, ...tUrl };
    });
    await Taro.$store.dispatch({
      type: "addPlayList",
      data: playList
    });
    return [det, url];
  },
  img(src) {
    return src ? src + "?param=500y500" : "";
  }
};
export default obj;
