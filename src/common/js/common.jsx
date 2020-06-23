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
    // 拿到前20条的url数据
    url.data.data.map(r => {
      let n = arr.findIndex(n => n.id === r.id); // 在20条数据中找到匹配的
      let _n = arr2.findIndex(n => n.id === r.id); // 在 全部id 中搜到匹配的
      arr2[_n] = { ...arr2[_n], ...arr[n], ...r }; // 数据合并
    });
    Taro.$store.dispatch({
      type: "ADDSONGURL",
      data: { ...data.data, ...{ url: arr2 } }
    });
    await Taro.$store.dispatch({
      type: "ADDPLAYNUM",
      data: arr2.findIndex(r => r.url)
    });
    return [data.data, arr2, arr2.findIndex(r => r.url)];
  },
  async musicDetail(arr) {
    // 这个接口拿到歌曲详情的信息（name, 图片等等）
    return http.get("song/detail", {
      ids: arr,
      timestamp: new Date()
    });
  },
  async musicUrl(arr) {
    // 这个接口拿到id的url
    return http.get("song/url", {
      id: arr,
      timestamp: new Date()
    });
  },
  async update() {
    let { playnum, songUrl } = Taro.$store.getState().counter;
    // 因为微信小程序具备后台播放的功能。所以配置的参数不同
    let [musicData, data] = [{}, songUrl.url[playnum]];
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
      type: "UPDATEAUDIOCONTEXT",
      data: musicData
    });
  }
};
export default obj;
