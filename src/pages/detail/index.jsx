import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import "./index.scss";
import { AtIcon, AtSlider } from "taro-ui";
import IconFont from "../../components/iconfont";
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
class Detail extends Component {
  config = {
    navigationBarTitleText: "详情",
    navigationStyle: "custom",
    disableScroll: true
  };
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
      sliderValue: 0,
      time: "00:00"
    };
  }
  componentDidMount() {}
  componentWillMount() {
    this.autoTime(false);
    // 自定义头部，初始化置顶
    this.setState({
      num: Taro.$navBarMarginTop
    });
    // 取消监听一个事件
    Taro.eventCenter.off("down");
    // 自动下一首的时候，当前播放时间归零
    Taro.eventCenter.on("down", () => {
      this.autoTime();
      this.setState({
        sliderValue: 0
      });
    });
  }
  componentDidShow() {}
  goback() {
    Taro.navigateBack({ delta: 1 });
  }
  // 暂停
  pause() {
    common.musicPause();
    clearInterval(this.trace);
  }
  // 开始
  begin() {
    common.musicPlay();
    this.autoTime(false);
  }
  // 上一首
  async up() {
    this.autoTime();
    this.setState({
      sliderValue: 0,
      time: "00:00"
    });
    common.up();
  }
  // 下一首
  async down() {
    this.autoTime();
    this.setState({
      sliderValue: 0,
      time: "00:00"
    });
    common.down();
  }
  // 拖动滚动条
  sliderChange(val) {
    this.setState({
      sliderValue: val,
      time: common.getTime(val)
    });
    this.props.counter.audioContext.seek(val);
    this.newTime = val;
  }
  trace = "";
  newTime = 0;
  autoTime(bu = true) {
    clearInterval(this.trace);
    this.newTime = bu
      ? 0
      : parseInt(this.props.counter.audioContext.currentTime || 0);
    this.setState({
      sliderValue: this.newTime,
      time: common.getTime(this.newTime)
    });
    this.trace = setInterval(() => {
      this.newTime++;
      this.setState({
        sliderValue: this.newTime,
        time: common.getTime(this.newTime)
      });
    }, 1000);
  }
  render() {
    let { playNum, musicType, playList } = this.props.counter;
    let data = playList[playNum];
    return (
      data && (
        <View
          className="details"
          style={{ paddingTop: [`${this.state.num}px`] }}
        >
          <Image className="song__bg" src={common.img(data.al.picUrl)} />
          <View className="navbar">
            <View onClick={this.goback.bind(this)} className="leftIcon">
              <AtIcon value="chevron-left" size="30" color="#fff"></AtIcon>
            </View>
            <View className="header">
              <View className="title">{data.name}</View>
              <View className="singer">
                <Text>{data.ar[0].name}</Text>
                <AtIcon value="chevron-right" size="15" color="#fff"></AtIcon>
              </View>
            </View>
            <View className="rightIcon"></View>
          </View>
          <View className="box">
            <Image
              src={require("../../common/img/aag.png")}
              className={`aag ${musicType ? "aag-running" : "aag-paused"}`}
            />
            <View className="play-parent">
              <Image
                src={require("../../common/img/play.png")}
                className="play"
              />
            </View>
            <Image
              src={common.img(data.al.picUrl)}
              className={`current-img ${
                musicType ? "animation-running" : "animation-paused"
              }`}
            />
          </View>
          <View className="footer">
            <IconFont name="SanMiAppglyphico10" size="50" />
            <IconFont name="left" size="50" />
            <IconFont name="bofang" size="50" />
            <IconFont name="right" size="50" />
            <IconFont name="SanMiAppglyphico12" size="50" />
          </View>
          <View className="scroolX">
            <View>{this.state.time}</View>
            <View className="slider">
              <AtSlider
                max={data && parseInt(data.dt / 1000)}
                value={this.state.sliderValue}
                activeColor="#fff"
                backgroundColor="#636363"
                blockColor="#fff"
                blockSize={12}
                onChange={this.sliderChange.bind(this)}
              ></AtSlider>
            </View>
            <View>{common.getTime(data && data.dt / 1000)}</View>
          </View>
          <View className="footer">
            <View>
              <IconFont name="SanMiAppglyphico10" size="50" />
            </View>
            <View onClick={this.up.bind(this)}>
              <IconFont name="left" size="50" />
            </View>
            {musicType ? (
              <View onClick={this.pause.bind(this)}>
                <IconFont name="zanting" size="80" />
              </View>
            ) : (
              <View onClick={this.begin.bind(this)}>
                <IconFont name="bofang" size="80" />
              </View>
            )}
            <View onClick={this.down.bind(this)}>
              <IconFont name="right" size="50" />
            </View>
            <View>
              <IconFont name="SanMiAppglyphico12" size="50" />
            </View>
          </View>
        </View>
      )
    );
  }
}
export default Detail;
