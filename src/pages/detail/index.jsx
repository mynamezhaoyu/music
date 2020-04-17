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
  componentDidMount() {
    this.setState({
      num: Taro.$navBarMarginTop
    });
    Taro.eventCenter.on('boxTrigger', () => {
      console.log(1);
    });
    Taro.eventCenter.on('down', () => {
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
  }
  // 开始
  begin() {
    this.props.counter.audioContext.play();
    this.props.addRedux(true, 'addMusicType');
  }
  // 上一首
  up() {
    this.setState({
      sliderValue: 0
    });
    let { playnum, songUrl, playList } = this.props.counter;
    let index = playnum - 1;
    let musicData = {};
    // 重置
    if (index < 0) {
      index = songUrl.length - 1;
    }
    this.props.addRedux(index, 'addPlayNum');
    if (!songUrl[index] || songUrl[index].url === null || !songUrl[index].url) {
      this.up();
      return;
    }
    let _obj = playList.playlist.tracks[index];
    musicData =
      process.env.TARO_ENV === 'weapp'
        ? {
            title: _obj.name,
            epname: _obj.ar[0].name,
            singer: _obj.al.name,
            coverImgUrl: _obj.al.picUrl,
            src: songUrl[index].url
          }
        : {
            src: songUrl[index].url
          };
    this.props.addRedux(musicData, 'updateAudioContext');
  }
  // 下一首
  down() {
    this.setState({
      sliderValue: 0
    });
    let { playnum, songUrl, playList } = this.props.counter;
    let index = playnum + 1;
    let musicData = {};
    // 重置
    if (index >= songUrl.length) {
      index = 0;
    }
    this.props.addRedux(index, 'addPlayNum');
    if (!songUrl[index] || songUrl[index].url === null || !songUrl[index].url) {
      this.down();
      return;
    }
    let _obj = playList.playlist.tracks[index];
    musicData =
      process.env.TARO_ENV === 'weapp'
        ? {
            title: _obj.name,
            epname: _obj.ar[0].name,
            singer: _obj.al.name,
            coverImgUrl: _obj.al.picUrl,
            src: songUrl[index].url
          }
        : {
            src: songUrl[index].url
          };
    this.props.addRedux(musicData, 'updateAudioContext');
  }
  getTime(val) {
    let arr = [val - (val % 1), parseInt((val % 1) * 60)];
    return `${arr[0] < 10 ? '0' + arr[0] : arr[0]}: ${arr[1] < 10 ? '0' + arr[1] : arr[1]}`;
  }
  sliderChange(val) {
    let { playList, playnum } = this.props.counter;
    let value = val.value;
    let num = playList.playlist.tracks[playnum].dt;
    if (value > parseInt(num / 1000) - 5) {
      value = parseInt(num / 1000) - 5;
    }
    this.setState({
      sliderValue: value,
      time: this.getTime(value / 60)
    });
    this.props.counter.audioContext.seek(value);
  }
  render() {
    let { songUrl, playList, playnum, musicType } = this.props.counter;
    let data = playList.playlist && playList.playlist.tracks[playnum];
    return (
      <View className="detail" style={{ paddingTop: [`${this.state.num}PX`] }}>
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
          <Image src={require('../../common/img/aag.png')} className="aag" />
          <Image src={require('../../common/img/play.png')} className="play" />
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
          <View>{this.getTime(data && data.dt / 60000)}</View>
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
