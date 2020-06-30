import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView, Image } from "@tarojs/components";
import "./personalized.scss";
import IconFont from "../iconfont";
import { common, http, addRedux, connect } from "../../common/js/export";

@connect(
  ({ counter }) => ({
    counter
  }),
  dispatch => ({
    addRedux(val, type) {
      dispatch(addRedux(val, type));
    }
  })
)
class Personalized extends Component {
  async play(val) {
    let arr = await common.play(val.id);
    // 只有点击播放按钮的时候，才往播放列表插入数据
    await Promise.all([
      Taro.$store.dispatch({
        type: "addPlayList",
        data: arr[1]
      }),
      Taro.$store.dispatch({
        type: "addPlayNum",
        data: arr[1].findIndex(r => r.url)
      })
    ]);
    Taro.eventCenter.trigger("playMusic");
  }
  async getPlayList(val) {
    Taro.navigateTo({
      url: "/pages/list/index"
    });
    let arr = await common.play(val.id);
    Taro.$store.dispatch({
      type: "updateSongList",
      data: { ...arr[0], ...{ url: arr[1] } }
    });
  }
  render() {
    return (
      <View className="personalized">
        <View className="title">推荐歌单</View>
        <View className="slogan">为你精挑细选</View>
        <ScrollView
          scrollX="true"
          scrollAnchoring="true"
          className="person-scroll"
        >
          {this.props.counter.personalized.map((r, i) => {
            return (
              <View className="list" key={r.name + i}>
                <View className="item">
                  <Image
                    src={common.img(r.picUrl)}
                    className="img"
                    onClick={this.getPlayList.bind(this, r)}
                  ></Image>
                  <View className="icon" onClick={this.play.bind(this, r)}>
                    <IconFont name="bofang" size="40" />
                  </View>
                  <View className="playCount">
                    {(r.playCount + "").length > 5
                      ? (r.playCount + " ").slice(0, -5) + " 万"
                      : r.playCount}
                  </View>
                </View>
                <View className="name" onClick={this.getPlayList.bind(this, r)}>
                  {r.name}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
export default Personalized;
