import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import IconFont from '../iconfont';
import './index.scss';
@connect(({ counter }) => ({
  counter
}))
class Play extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      type: true
    };
    console.log(context);
  }
  componentDidMount() {
    // const { store } = this.context;
    // console.log(store);
    // store.subscribe(() => this.change());
  }
  change() {
    // if (this.context.store.getState().counter.songUrl.length) {
    //   this.obj.play(this.context.store.getState().counter.songUrl);
    // }
  }
  obj = {
    innerAudioContext: '',
    play: (val) => {
      this.obj.innerAudioContext = Taro.createInnerAudioContext();
      this.obj.innerAudioContext.autoplay = true;
      this.obj.innerAudioContext.src = val[0].url;
      this.obj.innerAudioContext.onPlay();
    },
    pause: () => {
      this.obj.innerAudioContext.pause();
      this.setState({
        type: false
      });
    },
    begin: () => {
      this.obj.innerAudioContext.play();
      this.setState({
        type: true
      });
    },
    up() {},
    down() {}
  };
  render() {
    let { songUrl } = this.props.counter;
    let { playList } = this.props.counter;
    return (
      <View className="play fixed">
        {songUrl.length ? (
          <View className="main">
            <Image src={playList.playlist.tracks[0].al.picUrl} className="img" mode="widthFix"></Image>
            <View className="info">
              <Text>{playList.playlist.tracks[0].name}</Text>
              <Text>
                {playList.playlist.tracks[0].ar[0].name} - {playList.playlist.tracks[0].al.name}
              </Text>
            </View>
            <View className="icon">
              <IconFont name="shangyishou5" size="60" />
              {this.state.type ? (
                <View onClick={this.obj.pause.bind(this)}>
                  <IconFont name="zanting" size="60" />
                </View>
              ) : (
                <View onClick={this.obj.begin.bind(this)}>
                  <IconFont name="bofang1" size="60" />
                </View>
              )}
              <IconFont name="xiayishou5" size="60" />
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
