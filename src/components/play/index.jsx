import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import IconFont from '../iconfont';
import './index.scss';
import store from '../../store/index';
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
class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: true,
      num: 0
    };
  }
  componentDidMount() {
    store.subscribe(() => {
      this.change();
    });
  }
  componentDidShow() {}
  change() {
    let data = store.getState().counter.songUrl;
    if (data.length) {
      let num = data.findIndex((r) => r.url);
      this.setState({ num: num });
      this.play(data, num);
    }
  }
  innerAudioContext = '';
  play(val, num) {
    this.innerAudioContext = Taro.createInnerAudioContext();
    this.innerAudioContext.autoplay = true;
    this.innerAudioContext.src = val[num].url;
    this.innerAudioContext.onEnded(() => {
      console.log('结束了');
    });
    // this.obj.innerAudioContext.onPlay();
  }
  pause() {
    this.innerAudioContext.pause();
    this.setState({
      type: false
    });
  }
  begin() {
    this.innerAudioContext.play();
    this.setState({
      type: true
    });
  }
  // 上一首
  up(val = 1) {
    let { num } = this.state;
    let { songUrl } = this.props.counter;
    let index = num - 1;
    if (!index) {
      index = songUrl.length - 1;
    }
    if (songUrl[index].url === null || !songUrl[index].url) {
      this.up(val + 1);
      return;
    }
    this.innerAudioContext.src = songUrl[index].url;
    this.setState({
      num: index
    });
  }
  down(val = 1) {
    let { num } = this.state;
    let { songUrl } = this.props.counter;
    let index = num + val;
    if (index >= songUrl.length) {
      index = index - songUrl.length;
    }
    if (songUrl[index].url === null || !songUrl[index].url) {
      this.down(val + 1);
      return;
    }
    this.innerAudioContext.src = songUrl[index].url;
    this.setState({
      num: index
    });
  }
  render() {
    let { songUrl, playList } = this.props.counter;
    let { num } = this.state;
    return (
      <View className="play fixed">
        {songUrl.length ? (
          <View className="main">
            <Image src={playList.playlist.tracks[num].al.picUrl} mode="widthFix" className={this.state.type ? 'img animation-running' : 'img animation-paused'}></Image>
            <View className="info">
              <Text>{playList.playlist.tracks[num].name}</Text>
              <Text>
                {playList.playlist.tracks[num].ar[0].name} - {playList.playlist.tracks[num].al.name}
              </Text>
            </View>
            <View className="icon">
              <View onClick={this.up.bind(this, -1)}>
                <IconFont name="shangyishou5" size="60" />
              </View>
              {this.state.type ? (
                <View onClick={this.pause.bind(this)}>
                  <IconFont name="zanting" size="60" />
                </View>
              ) : (
                <View onClick={this.begin.bind(this)}>
                  <IconFont name="bofang1" size="60" />
                </View>
              )}
              <View onClick={this.down.bind(this, 1)}>
                <IconFont name="xiayishou5" size="60" />
              </View>
            </View>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    );
  }
}
export default Play;
