import http from "../../services/api";
import Taro from "@tarojs/taro";
let obj = {
  async play(id) {
    // 先拿歌单详情
    let data = await http.get("playlist/detail", {
      id: id,
      timestamp: new Date()
    });
    let arr = data.data.playlist.tracks; // 歌单详情里面已经给出前20条数据 但是不包含url地址
    let arr2 = data.data.playlist.trackIds; // 歌单的全部id
    let url = await this.musicUrl(arr.map(r => r.id).join(",")); // 拿这20条带id的数据 去取url， 因为已经包含了name，图片信息，所以不需要单独在调用歌曲详情接口
    // 拿到前20条的url数据(网易云接口变了，现在只显示10条了。很难受。这样就导致查看歌单详情滚动的时候。有bug.阿西吧)
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
    if (index !== undefined) {
      await Taro.$store.dispatch({
        type: "addPlayNum",
        data: index
      });
    }
    let { playNum, musicType, playList } = Taro.$store.getState().counter;
    // 因为微信小程序具备后台播放的功能。所以配置的参数不同
    let [musicData, data] = [{}, playList[playNum]];
    if (process.env.TARO_ENV === "weapp") {
      musicData = {
        title: data.name,
        epname: data.ar[0].name,
        singer: data.al.name,
        coverImgUrl: data.al.picUrl,
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
    if (!playList[index].url) {
      // 如果没有url，用id请求数据
      let data = await this.httpDetUrl(playList[index].id);
      await Taro.$store.dispatch({
        type: "addPlayList",
        data: data[2]
      });
      if (data[1][0].url) {
        // 如果请求回来还是没有url，那么证明这首歌，是收费或者是vip歌曲。直接进行下一首。
        this.update(index);
      } else {
        await Taro.$store.dispatch({
          type: "addPlayNum",
          data: index
        });
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
    if (!playList[index].url) {
      // taro 这里给我自动编译成取反，无解。我只能手动加取反
      // 如果没有url，用id请求数据
      let data = await this.httpDetUrl(playList[index].id);
      await Taro.$store.dispatch({
        type: "addPlayList",
        data: data[2]
      });
      if (data[1][0].url) {
        // 如果请求回来还是没有url，那么证明这首歌，是收费或者是vip歌曲。直接进行下一首。
        this.update(index);
      } else {
        await Taro.$store.dispatch({
          type: "addPlayNum",
          data: index
        });
        this.down();
      }
      return;
    }
    // 如果有url直接播放，如果错误了，单独处理。不再这么进行。
    this.update(index);
  },
  async httpDetUrl(arr, type = true) {
    // 请求歌曲详情，歌曲url。可以多个id，也可以单个id。可以是播放列表滚动请求，也可以是歌单列表滚动。
    arr = arr + "";
    let { playList, songList } = Taro.$store.getState().counter;
    // 请求没有url的数据
    let data = type ? playList : songList.url;
    let [det, url] = await Promise.all([
      this.musicDetail(arr),
      this.musicUrl(arr)
    ]);
    [det, url] = [det.data.songs, url.data.data];
    arr.split(",").map(r => {
      r = Number(r);
      let [tDet, tUrl, tPlayList, tPlayListIndex] = [
        // 找到对应id的详情，找对对象Id的url数据，找到原先没有URl的数据，找到原先播放列表数据的位置
        det.filter(n => n.id === r)[0],
        url.filter(n => n.id === r)[0],
        data.filter(n => n.id === r)[0],
        data.findIndex(n => n.id === r)
      ];
      data[tPlayListIndex] = { ...{}, ...tPlayList, ...tDet, ...tUrl };
    });
    return [det, url, data];
  },
  img(src) {
    // 给图片加个限制，不然请求的图片太大了。
    return src ? src + "?param=500y500" : "";
  }
};
export default obj;
