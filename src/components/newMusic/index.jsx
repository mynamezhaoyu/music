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
    this.setState({ count: val });
  }
  render() {
    let { newMusic } = this.props.counter;
    let arr = newMusic
      .map((r, i) => ((i / 3) % 1 === 0 ? newMusic.slice(i, i + 3) : ""))
      .filter(r => r);
    return (
      arr.length && (
        <View className="new-music">
          <View className="title">
            <View className="more">
              <View
                className={this.count ? "active" : ""}
                onClick={this.onTaggle.bind(this, true)}
              >
                新歌
              </View>
              <View>|</View>
              <View
                className={this.count ? "" : "active"}
                onClick={this.onTaggle.bind(this, false)}
              >
                新碟
              </View>
            </View>
            <View>查看更多</View>
          </View>
          <View className="music">
            <Swiper circular={true} className="music-swiper">
              {arr.map((r, i) => {
                return (
                  <SwiperItem key={r + i}>
                    <View className="item">
                      {r.map(n => {
                        return (
                          <View key={n.name} className="info">
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
          </View>
        </View>
      )
    );
  }
}
export default Header;
