import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import './index.scss';
import http from '../../services/api';
import { connect } from '@tarojs/redux';
import { addRedux } from '../../actions/counter';
import { AtIcon, AtSlider } from 'taro-ui';
import IconFont from '../../components/iconfont';
@connect(
  ({ counter }) => ({
    counter
  }),
  (dispatch) => ({
    addRedux(val, type) {
      dispatch(addRedux(val, type));
    }
  })
)
class Detail extends Component {
  config = {
    navigationBarTitleText: '详情',
    navigationStyle: 'custom',
    disableScroll: true
  };
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
      sliderValue: 0,
      time: '00:00'
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
    Taro.eventCenter.off('down');
    // 自动下一首的时候，当前播放时间归零
    Taro.eventCenter.on('down', () => {
      this.autoTime();
      this.setState({
        sliderValue: 0
      });
    });
  }
  componentDidShow() {}
  getSongDetail() {}
  goback() {
    Taro.navigateBack({ delta: 1 });
  }
  axiba() {
    console.log(1);
  }
  // 暂停
  pause() {
    this.props.counter.audioContext.pause();
    this.props.addRedux(false, 'addMusicType');
    clearInterval(this.trace);
  }
  // 开始
  begin() {
    this.props.counter.audioContext.play();
    this.props.addRedux(true, 'addMusicType');
    this.autoTime(false);
  }
  // 上一首
  async up() {
    this.autoTime();
    this.setState({
      sliderValue: 0,
      time: '00:00'
    });
    let { playnum, songUrl} = this.props.counter;
    let index = playnum - 1;
    let musicData = {};
    // 重置
    if (index < 0) {
      index = songUrl.length - 1;
    }
    await this.props.addRedux(index, 'addPlayNum');
    if (!songUrl[index] || songUrl[index].url === null || !songUrl[index].url) {
      this.up();
      return;
    }
    let _obj = songUrl[index];
    musicData =
      process.env.TARO_ENV === 'weapp'
        ? {
            title: _obj.name,
            epname: _obj.ar[0].name,
            singer: _obj.al.name,
            coverImgUrl: _obj.al.picUrl,
            src: this.getUrl(index)
          }
        : {
            src: this.getUrl(index)
          };
    this.props.addRedux(musicData, 'updateAudioContext');
    if (!this.props.counter.addMusicType) {
      this.props.addRedux(true, 'addMusicType');
    }
  }
  getUrl(index) {
    let { playnum, songUrl } = this.props.counter;
    return songUrl[index ? index : playnum].url || `https://music.163.com/song/media/outer/url?id=${songUrl[index ? index : playnum].id}.mp3`;
  }
  // 下一首
  async down() {
    this.autoTime();
    this.setState({
      sliderValue: 0,
      time: '00:00'
    });
    let { playnum, songUrl } = this.props.counter;
    let index = playnum + 1;
    let musicData = {};
    // 重置
    if (index >= songUrl.length) {
      index = 0;
    }
    await this.props.addRedux(index, 'addPlayNum');
    if (!songUrl[index] || songUrl[index].url === null || !songUrl[index].url) {
      this.down();
      return;
    }
    console.log(this.getUrl(index));
    let _obj = songUrl[index];
    musicData =
      process.env.TARO_ENV === 'weapp'
        ? {
            title: _obj.name,
            epname: _obj.ar[0].name,
            singer: _obj.al.name,
            coverImgUrl: _obj.al.picUrl,
            src: this.getUrl(index)
          }
        : {
            src: this.getUrl(index)
          };
    this.props.addRedux(musicData, 'updateAudioContext');
    if (!this.props.counter.addMusicType) {
      this.props.addRedux(true, 'addMusicType');
    }
  }
  getTime(val) {
    val = val / 60;
    let arr = [val - (val % 1), parseInt((val % 1) * 60)];
    return `${arr[0] < 10 ? '0' + arr[0] : arr[0]}: ${arr[1] < 10 ? '0' + arr[1] : arr[1]}`;
  }
  // 拖动滚动条
  sliderChange(val) {
    let value = val.value;
    this.setState({
      sliderValue: value,
      time: this.getTime(value)
    });
    this.props.counter.audioContext.seek(value);
    this.newTime = value;
  }
  trace = '';
  newTime = 0;
  autoTime(bu = true) {
    clearInterval(this.trace);
    this.newTime = bu ? 0 : parseInt(this.props.counter.audioContext.currentTime);
    this.setState({
      sliderValue: this.newTime,
      time: this.getTime(this.newTime)
    });
    this.trace = setInterval(() => {
      this.newTime++;
      this.setState({
        sliderValue: this.newTime,
        time: this.getTime(this.newTime)
      });
    }, 1000);
  }
  render() {
    let { playnum, musicType, songUrl } = this.props.counter;
    let data = songUrl && songUrl[playnum];
    return (
      <View className="detail" style={{ paddingTop: [`${this.state.num}PX`] }}>
        <Image className="song__bg" src={data.al.picUrl} />
        <View className="navbar">
          <View onClick={this.goback.bind(this)} className="leftIcon">
            <AtIcon value="chevron-left" size="30" color="#fff"></AtIcon>
          </View>
          <View className="header">
            <View className="title">{data.name}</View>
            <View className="singer" onClick={this.axiba.bind(this)}>
              <Text>{data.ar[0].name}</Text>
              <AtIcon value="chevron-right" size="15" color="#fff"></AtIcon>
            </View>
          </View>
          <View className="rightIcon"></View>
        </View>
        <View className="box">
          <Image src={require('../../common/img/aag.png')} className={`aag ${musicType ? 'aag-running' : 'aag-paused'}`} />
          <View className="play-parent">
            <Image src={require('../../common/img/play.png')} className="play" />
          </View>
          <Image src={data.al.picUrl} className={`current-img ${musicType ? 'animation-running' : 'animation-paused'}`} />
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
          <View>{this.getTime(data && data.dt / 1000)}</View>
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
    );
  }
}
export default Detail;
