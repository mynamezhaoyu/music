import Taro, { Component } from "@tarojs/taro";
import "./index.scss";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import IconFont from "../../components/iconfont";
import { common, http, addRedux, connect } from "../../common/js/export";
@connect(({ counter }) => ({
  counter
}))
class List extends Component {
  config = {
    navigationBarTitleText: "歌单",
    navigationStyle: "custom"
  };
  constructor(props) {
    super(props);
    this.state = {
      num: 2,
      y: true,
      top: 0
    };
  }
  componentDidMount() {}
  componentWillMount() {
    // 自定义头部，初始化置顶
    this.setState({
      top: Taro.$navBarMarginTop
    });
  }
  async onScrollToLower() {
    // 滚动到底部触发事件
    let { songList } = this.props.counter;
    let num = this.state.num;
    if (num * 10 < songList.url.length) {
      let arr = songList.url
        .slice(num * 10, num * 10 + 10)
        .filter(r => !r.url)
        .map(r => r.id)
        .join(",");
      if (arr.length) await common.httpDetUrl(arr, false);
      this.setState({
        num: this.state.num + 1
      });
    }
  }
  async play(val) {
    // 歌单列表点击了播放
    let { playList } = this.props.counter;
    let index = playList.findIndex(r => val.id === r.id);
    if (val.url) {
      if (index === -1) {
        // 如果不在歌单列表中, 手动给他加一条。
        await Taro.$store.dispatch({
          type: "addPlayList",
          data: playList.concat(val)
        });
        index = playList.length - 1;
      } else if (index > -1 && !playList[index].val) {
        // 如果在歌单中，
        playList[index] = val;
        await Taro.$store.dispatch({
          type: "addPlayList",
          data: playList
        });
      }
      await common.update(index);
    } else {
      await common.httpDetUrl(val.id);
    }
    Taro.navigateTo({
      url: "/pages/detail/index"
    });
  }
  async subscribe() {
    Taro.showToast({
      title: "收藏接口暂不可用！后期更新！",
      icon: "none"
    });
    // let { songList } = this.props.counter;
    // await http.get("playlist/subscribe", {
    //   t: 1,
    //   id: songList.playlist.id
    // });
  }
  async playAll() {
    // 歌单列表点击了播放
    let { playList, songList } = this.props.counter;
    let index = playList.length;
    await Taro.$store.dispatch({
      type: "addPlayList",
      data: songList.url
    });
    await common.update(index);
    Taro.navigateTo({
      url: "/pages/detail/index"
    });
  }
  componentDidShow() {}
  render() {
    let { songList } = this.props.counter;
    let [url, data] = [songList.url, songList.playlist];
    return (
      url && (
        <View className="list" style={{ paddingTop: [`${this.state.top}PX`] }}>
          <Image className="song__bg" src={common.img(data.coverImgUrl)} />
          <ScrollView
            className="scrollview"
            scrollY={this.state.y}
            scrollWithAnimation
            enableBackToTop
            scrollAnchoring={true}
            onScrollToLower={() => {
              this.setState({
                y: false
              });
            }}
          >
            <View className="navbar">
              <View
                onClick={() => {
                  Taro.navigateBack({ delta: 1 });
                }}
                className="navbar-left"
              >
                <AtIcon value="chevron-left" size="30" color="#fff"></AtIcon>
              </View>
              <View className="navbar-center">歌单</View>
              <View className="navbar-right"></View>
            </View>
            <View
              className="info"
              style={{
                height: [`${this.state.y ? "200px" : "0"}`],
                opacity: [`${this.state.y ? 1 : 0}`],
                padding: [`${this.state.y ? "" : 0}`],
                transition: [`${this.state.y ? "all 1s" : ""}`]
              }}
            >
              <View className="info-top">
                <Image
                  src={common.img(data.coverImgUrl)}
                  className="img"
                  lazyLoad={true}
                />
                <View className="playCount">
                  {(data.playCount + "").length > 5
                    ? (data.playCount + " ").slice(0, -5) + " 万"
                    : data.playCount}
                </View>
                <View className="text-area">
                  <View className="name line-clamp2">{data.name}</View>
                  <View className="u-name">
                    <Image
                      src={common.img(data.creator.avatarUrl)}
                      className="u-img"
                    />
                    {data.creator.userType === 200 && (
                      <Text className="vip"></Text>
                    )}
                    <Text>{data.creator.nickname}</Text>
                  </View>
                  <View className="line-clamp2 introduction">
                    {data.description}
                  </View>
                </View>
              </View>
              <View className="info-bottom">
                <View className="icon">
                  <IconFont name="pinglun1" size="50" color="#fff" />
                  <Text>{data.commentCount}</Text>
                </View>
                <View className="icon">
                  <IconFont name="pinglun" size="50" color="#fff" />
                  <Text>多选</Text>
                </View>
              </View>
            </View>
            <View className="song">
              <View className="header">
                <View className="play" onClick={this.playAll}>
                  <IconFont name="bofang" size="50" />
                  <Text className="all">播放全部</Text>
                  <Text className="all-music">(共{url.length}首)</Text>
                </View>
                <View className="collect" onClick={this.subscribe.bind(this)}>
                  + 收藏(
                  {(data.subscribedCount + " ").length > 5
                    ? (data.subscribedCount + " ").slice(0, -5) + " 万"
                    : data.subscribedCount}
                  )
                </View>
              </View>
              <ScrollView
                className="scrollview"
                scrollY={!this.state.y}
                scrollWithAnimation
                enableBackToTop
                scrollAnchoring={true}
                onScrollToUpper={() => {
                  this.setState({
                    y: true
                  });
                }}
                onScrollToLower={this.onScrollToLower.bind(this)}
              >
                <View className="music-list">
                  {url.map((r, i) => {
                    if (i < this.state.num * 10)
                      return (
                        <View
                          className="detail"
                          key={r.name + i}
                          onClick={this.play.bind(this, r)}
                        >
                          <View className="name">
                            <View className="num">{i + 1}</View>
                            <View className="f-1">
                              <View className="line-clamp1">{r.name}</View>
                              <View className="singer">
                                {r.ar && r.ar[0].name}
                              </View>
                            </View>
                          </View>
                          <View className="more">
                            <IconFont name="ziyuan" size="50" color="#fff" />
                          </View>
                        </View>
                      );
                  })}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      )
    );
  }
}
export default List;
