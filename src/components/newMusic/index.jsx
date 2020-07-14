import Taro, { Component } from "@tarojs/taro";
import { View, Swiper, SwiperItem, Image } from "@tarojs/components";
import { AtSearchBar } from "taro-ui";
import "./index.scss";
import { common, http, addRedux, connect } from "../../common/js/export";
import IconFont from "../iconfont";
@connect(({ counter }) => ({
  counter
}))
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: true
    };
  }
  componentDidMount() {
    // 整个页面只需要执行一次的时候用这个
  }
  componentDidShow() {}
  onTaggle(val) {
    if (!val && !this.props.counter.newDisc.length) {
      // 请求推荐歌单数据
      http.get("album/newest").then(res => {
        Taro.$store.dispatch({
          type: "addNewDisc",
          data: res.data.albums
        });
      });
    }
    this.setState({ count: val });
  }
  async play(val, type) {
    // 歌单列表点击了播放
    let { playList, songList } = this.props.counter;
    if (type === 1) {
      let index = playList.findIndex(r => val.id === r.id);
      if (index === -1) {
        // 如果不在歌单列表中, 手动给他加一条。
        let url = await common.musicUrl(val.id);
        let det = await common.musicDetail(val.id);
        await Taro.$store.dispatch({
          type: "addPlayList",
          data: playList.concat({ ...url.data.data[0], ...det.data.songs[0] })
        });
        index = playList.length - 1;
      } else if (index > -1 && !playList[index].url) {
        // 如果在歌单中，
        playList[index] = data[2];
        await Taro.$store.dispatch({
          type: "addPlayList",
          data: playList
        });
      }
      await common.update(index);
      // Taro.navigateTo({
      //   url: "/pages/detail/index"
      // });
      return;
    }
    let data = await http.get("album", {
      id: val.id,
      timestamp: new Date()
    });
    let { album, songs } = data.data;
    await Taro.$store.dispatch({
      type: "updateSongList",
      data: {
        url: songs,
        playlist: {
          img: album.picUrl,
          playCount: 0,
          name: album.name,
          avatarUrl: album.artist.picUrl,
          userType: 200,
          nickname: album.artist.name,
          description: album.description,
          commentCount: 0,
          subscribedCount: 0
        }
      }
    });
    // coverImgUrl playCount name creator.avatarUrl creator.userType creator.nickname description commentCount subscribedCount
    Taro.navigateTo({
      url: "/pages/list/index"
    });
  }
  render() {
    let { newMusic, newDisc } = this.props.counter;
    let arr = newMusic
      .map((r, i) => ((i / 3) % 1 === 0 ? newMusic.slice(i, i + 3) : ""))
      .filter(r => r);
    let arrDisc = newDisc
      .map((r, i) => ((i / 3) % 1 === 0 ? newDisc.slice(i, i + 3) : ""))
      .filter(r => r);
    return (
      <View className="new-music">
        <View className="title">
          <View className="more">
            <View
              className={this.state.count ? "title-active" : ""}
              onClick={this.onTaggle.bind(this, true)}
            >
              新歌
            </View>
            <View>|</View>
            <View
              className={this.state.count ? "" : "title-active"}
              onClick={this.onTaggle.bind(this, false)}
            >
              新碟
            </View>
          </View>
          <View></View>
        </View>
        <View className="box">
          <View className={this.state.count ? "music active" : "music"} style>
            {arr.length && (
              <Swiper circular={true} className="music-swiper">
                {arr.map((r, i) => {
                  return (
                    <SwiperItem key={r + i}>
                      <View className="item">
                        {r.map(n => {
                          return (
                            <View
                              key={n.name}
                              className="info"
                              onClick={this.play.bind(this, n, 1)}
                            >
                              <Image
                                lazyLoad="true"
                                src={common.img(n.picUrl)}
                                className="item-img"
                              ></Image>
                              <View className="name">
                                <View>{n.name}</View>
                                <View>
                                  {n.song.artists.map(c => c.name).join("/")}
                                </View>
                              </View>
                              <IconFont name="bofang" size="40" />
                            </View>
                          );
                        })}
                      </View>
                    </SwiperItem>
                  );
                })}
              </Swiper>
            )}
          </View>
          <View className={this.state.count ? "disc" : "disc active"}>
            <Swiper circular={true} className="music-swiper">
              {arrDisc.map((r, i) => {
                return (
                  <SwiperItem key={r + i}>
                    <View className="item">
                      {r.map(n => {
                        return (
                          <View
                            key={n.name}
                            className="info"
                            onClick={this.play.bind(this, n, 2)}
                          >
                            <Image
                              lazyLoad="true"
                              src={common.img(n.picUrl)}
                              className="item-img"
                            ></Image>
                            <View className="name">
                              <View>{n.name}</View>
                              <View>
                                {n.artists.map(c => c.name).join("/")}
                              </View>
                            </View>
                            <IconFont name="bofang" size="40" />
                          </View>
                        );
                      })}
                    </View>
                  </SwiperItem>
                );
              })}
            </Swiper>
          </View>
        </View>
      </View>
    );
  }
}
export default Header;
