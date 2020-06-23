import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import IconFont from "../iconfont";
import "./index.scss";
import { addRedux } from "../../actions/counter";
import common from "../../common/js/common";
import { AtList, AtListItem, AtFloatLayout } from "taro-ui";
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
class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      floatLayout: false,
      num: 1
    };
  }
  componentWillMount() {
    Taro.eventCenter.on("playMusic", () => {
      this.play();
    });
  }

  // 初始化播放
  async play() {
    this.setState({
      floatLayout: false,
      num: 1
    });
    await common.update();
    let audio = this.props.counter.audioContext;
    // 监听播放完了，接着放下一首
    audio.onEnded(() => {
      this.down();
      Taro.eventCenter.trigger("down");
    });
    // 监听失败看看为啥失败，再解决这个问题
    audio.onError(err => {
      console.log("你TM的为啥失败", err);
      this.down();
      Taro.eventCenter.trigger("down");
    });
    if (process.env.TARO_ENV === "h5") {
      audio.onStop(() => {
        audio.play();
        audio.seek(this.time + 0.2);
      });
      audio.onTimeUpdate(() => {
        this.time = audio.currentTime;
      });
    }
  }
  // 暂停
  pause() {
    this.props.counter.audioContext.pause();
    this.props.addRedux(false, "addMusicType");
  }
  // 开始
  begin() {
    this.props.counter.audioContext.play();
    this.props.addRedux(true, "addMusicType");
  }
  // 上一首
  async up() {
    let { playnum, songUrl } = this.props.counter;
    let url = songUrl.url;
    let index = playnum - 1;
    // 重置
    if (index < 0) {
      index = url.length - 1;
    }
    await this.props.addRedux(index, "addPlayNum");
    if (!url[index] || url[index].url === null || !url[index].url) {
      this.up();
      return;
    }
    common.update();
  }
  // 下一首
  async down() {
    let { playnum, songUrl } = this.props.counter;
    let url = songUrl.url;
    let index = playnum + 1;
    // 重置
    if (index >= url.length) {
      index = 0;
    }
    await this.props.addRedux(index, "addPlayNum");
    if (!url[index] || url[index].url === null || !url[index].url) {
      this.down();
      return;
    }
    common.update();
  }
  handleChange(val) {
    this.setState(
      !this.state.floatLayout
        ? {
            isOpened: val,
            floatLayout: true
          }
        : {
            isOpened: val
          }
    );
  }
  onScrollToLower() {
    let { songUrl } = this.props.counter;
    let url = songUrl.url;
    if (this.state.num * 10 < url.length) {
      this.setState({
        num: this.state.num + 1
      });
    }
  }
  async changePlaynum(i) {
    await this.props.addRedux(i, "addPlayNum");
    common.update();
  }
  onClickImg() {
    Taro.navigateTo({
      url: "/pages/detail/index"
    });
  }
  getTime(i) {
    let { songUrl } = this.props.counter;
    let url = songUrl.url;
    let time = url[i].dt / 60000;
    let arr = [time - (time % 1), parseInt((time % 1) * 60)];
    return `${arr[0] < 10 ? "0" + arr[0] : arr[0]}: ${
      arr[1] < 10 ? "0" + arr[1] : arr[1]
    }`;
  }
  render() {
    let { songUrl, playnum, musicType } = this.props.counter;
    let url = songUrl.url;
    return (
      <View className="play fixed">
        {url && url.length ? (
          <View className="main">
            <Image
              onClick={this.onClickImg}
              src={url[playnum].al.picUrl}
              mode="widthFix"
              className={
                musicType ? "img animation-running" : "img animation-paused"
              }
            ></Image>
            <View className="info">
              <Text>{url[playnum].name}</Text>
              <Text>
                {url[playnum].ar[0].name} - {url[playnum].al.name}
              </Text>
            </View>
            <View className="icon">
              <View onClick={this.up.bind(this, -1)}>
                <IconFont name="up" size="60" />
              </View>
              {musicType ? (
                <View onClick={this.pause.bind(this)}>
                  <IconFont name="zanting" size="60" />
                </View>
              ) : (
                <View onClick={this.begin.bind(this)}>
                  <IconFont name="bofang" size="60" />
                </View>
              )}
              <View onClick={this.down.bind(this, 1)}>
                <IconFont name="down" size="60" />
              </View>
              <View onClick={this.handleChange.bind(this, true)}>
                <IconFont name="SanMiAppglyphico12" size="60" />
              </View>
            </View>
            <View>
              {this.state.floatLayout && (
                <AtFloatLayout
                  isOpened={this.state.isOpened}
                  className="playatfloatlayout"
                  title={`当前播放 ${url.length}`}
                  onClose={this.handleChange.bind(this, false)}
                >
                  <ScrollView
                    scrollY
                    scrollWithAnimation
                    scrollAnchoring
                    onScrollToLower={this.onScrollToLower.bind(this)}
                    style={{ height: ["300px"] }}
                  >
                    <AtList>
                      {url.map((r, i) => {
                        if (i < this.state.num * 10)
                          return (
                            <AtListItem
                              className={i === playnum ? "listActive" : ""}
                              thumb={r.al.picUrl}
                              disabled={url[i].url ? false : true}
                              title={r.name + " - " + r.ar[0].name}
                              key={r.name + i}
                              extraText={common.getTime(r.dt / 1000)}
                              onClick={this.changePlaynum.bind(this, i)}
                            />
                          );
                      })}
                    </AtList>
                  </ScrollView>
                </AtFloatLayout>
              )}
            </View>
          </View>
        ) : (
          ""
        )}
      </View>
    );
  }
}
export default Play;
