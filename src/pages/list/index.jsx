import Taro, { Component } from "@tarojs/taro";
import "./index.scss";
import { connect } from "@tarojs/redux";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { addRedux } from "../../actions/counter";
import { AtIcon } from "taro-ui";
import IconFont from "../../components/iconfont";
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
      num: 0
    };
  }
  componentDidMount() {}
  componentWillMount() {
    // 自定义头部，初始化置顶
    this.setState({
      num: Taro.$navBarMarginTop
    });
  }
  componentDidShow() {}
  render() {
    let { playList, songUrl } = this.props.counter;
    let [data, url] = [playList.playlist, songUrl];
    return (
      data && (
        <View className="list" style={{ paddingTop: [`${this.state.num}PX`] }}>
          <Image className="song__bg" src={data.coverImgUrl} />
          <ScrollView
            className="scrollview"
            scrollY
            scrollWithAnimation
            enableBackToTop
            scrollAnchoring={true}
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
            <View className="info">
              <View className="info-top">
                <Image src={data.coverImgUrl} className="img" />
                <View className="playCount">
                  {(data.playCount + "").length > 5
                    ? (data.playCount + " ").slice(0, -5) + " 万"
                    : data.playCount}
                </View>
                <View className="text-area">
                  <View className="name line-clamp2">{data.name}</View>
                  <View className="u-name">
                    <Image src={data.creator.avatarUrl} className="u-img" />
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
                <View className="play">
                  <IconFont name="bofang" size="50" />
                  <Text className="all">播放全部</Text>
                  <Text className="all-music">(共{url.length}首)</Text>
                </View>
                <View className="collect">收藏</View>
              </View>
              <View className="music-list">
                {url.map((r, i) => {
                  return (
                    <View className="detail" key={r.name + i}>
                      <View className="name">
                        <Text>{i + 1}</Text>
                        <View>{r.name}</View>
                      </View>
                      <View>...</View>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      )
    );
  }
}
export default List;
