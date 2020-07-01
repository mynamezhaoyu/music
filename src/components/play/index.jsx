import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, ScrollView } from "@tarojs/components";
import IconFont from "../iconfont";
import "./index.scss";
import { AtList, AtListItem, AtFloatLayout } from "taro-ui";
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
    common.musicPause();
  }
  // 开始
  begin() {
    common.musicPlay();
  }
  // 上一首
  async up() {
    common.up();
  }
  // 下一首
  async down() {
    common.down();
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
  async onScrollToLower() {
    // 滚动到底部触发事件
    let { playList } = this.props.counter;
    let num = this.state.num;
    if (num * 10 < playList.length) {
      let arr = playList
        .slice(num * 10, num * 10 + 10)
        .filter(r => !r.url)
        .map(r => r.id)
        .join(",");
      if (arr.length) await common.httpDetUrl(arr);
      this.setState({
        num: num + 1
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
  render() {
    let { playNum, musicType, playList } = this.props.counter;
    return (
      <View className="plays fixed">
        {playList.length ? (
          <View className="main">
            <Image
              onClick={this.onClickImg}
              src={common.img(playList[playNum].al.picUrl)}
              mode="widthFix"
              className={
                musicType ? "img animation-running" : "img animation-paused"
              }
            ></Image>
            <View className="info">
              <Text>{playList[playNum].name}</Text>
              <Text>
                {playList[playNum].ar[0].name} - {playList[playNum].al.name}
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
                  title={`当前播放 ${playList.length}`}
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
                      {playList.map((r, i) => {
                        if (i < this.state.num * 10)
                          return (
                            <AtListItem
                              className={i === playNum ? "listActive" : ""}
                              thumb={common.img(r.al.picUrl)}
                              disabled={playList[i].url ? false : true}
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
