import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./personalized.scss";
import IconFont from "../iconfont";
import http from "../../services/api";
import common from "../../common/js/common";
import { addRedux } from "../../actions/counter";

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
    this.props.handleClickplay(val);
  }
  async playList(val) {
    Taro.navigateTo({
      url: "/pages/list/index"
    });
    let { playList } = this.props.counter;
    if (playList.playlist && playList.playlist.id === val.id) return;
    let arr = await common.play(val.id);
    // 存到redux
    this.props.addRedux(arr[0], "addPlayList");
    this.props.addRedux(arr[1], "addSongUrl");
    await this.props.addRedux(arr[2], "addPlayNum");
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
                    src={r.picUrl}
                    className="img"
                    onClick={this.playList.bind(this, r)}
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
                <View className="name" onClick={this.playList.bind(this, r)}>
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
