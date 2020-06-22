import http from "../../services/api";
let obj = {
  async play(id) {
    // 先拿歌单详情
    let data = await http.get("playlist/detail", {
      id: id,
      timestamp: new Date()
    });
    // 歌单详情可以拿到歌单里面所有的id
    let arr = data.data.playlist.trackIds.map(r => r.id);
    arr.splice(500);
    arr = arr.join(",");
    // 这个接口拿到歌曲详情的信息（name, 图片等等）
    let detailFn = http.get("song/detail", {
      ids: arr,
      timestamp: new Date()
    });
    // 这个接口拿到id的url
    let urlFn = http.get("song/url", {
      id: arr,
      timestamp: new Date()
    });
    // 同时等待
    let [detail, urlData] = [await detailFn, await urlFn];
    // 赋值
    [detail, urlData] = [detail.data.songs, urlData.data.data];
    let _extend = [];
    // url匹配
    detail.map((r, i) => {
      _extend[i] = { ...r, ...urlData.filter(n => n.id === r.id)[0] };
    });
    // 第几首歌能播放
    let num = _extend.findIndex(r => r.url);
    return [data.data, _extend, num];
  }
};
export default obj;
