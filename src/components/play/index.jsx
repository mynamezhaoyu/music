import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import IconFont from '../iconfont';
import './index.scss';
import store from '../../store/index';
import { addRedux } from '../../actions/counter';
import { AtList, AtListItem, AtFloatLayout } from 'taro-ui';
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
      obj: [],
      isOpened: false
    };
  }
  componentDidMount() {
    store.subscribe(() => {
      this.change();
    });
  }
  componentDidShow() {}
  // redux值变化的时候触发
  change() {
    let data = store.getState().counter.songUrl;
    // 因为不管什么redux值变化都会触发，所以把songUrl的值缓存给当前页面的state
    // 然后判断redux的变化的时候，二个对象是否还是一样的。如果是一样的不触发变化
    if (data.length && !Object.is(data, this.state.obj)) {
      this.setState({ obj: data }, () => {
        // 同步
        let num = data.findIndex((r) => r.url);
        this.props.addRedux(num, 'addPlayNum');
        this.play(data, num);
      });
    }
  }
  innerAudioContext = ''; // 存放音乐的值
  // 初始化播放
  play(data, num) {
    let { playList } = this.props.counter;
    if (!this.innerAudioContext) {
      this.innerAudioContext = process.env.TARO_ENV === 'weapp' ? Taro.getBackgroundAudioManager() : Taro.createInnerAudioContext();
    }
    // 因为微信小程序具备后台播放的功能。所以配置的参数不同
    let musicData = {};
    if (process.env.TARO_ENV === 'weapp') {
      let _obj = playList.playlist.tracks[num];
      musicData = {
        title: _obj.name,
        epname: _obj.ar[0].name,
        singer: _obj.al.name,
        coverImgUrl: _obj.al.picUrl,
        src: data[num].url
      };
    } else {
      musicData = {
        autoplay: true,
        src: data[num].url
      };
    }
    Object.assign(this.innerAudioContext, musicData);
    // 监听播放完了，接着放下一首
    this.innerAudioContext.onEnded(() => {
      this.down();
    });
    // this.obj.innerAudioContext.onPlay();
  }
  // 暂停
  pause() {
    this.innerAudioContext.pause();
    this.setState({
      type: false
    });
  }
  // 开始
  begin() {
    this.innerAudioContext.play();
    this.setState({
      type: true
    });
  }
  // 上一首
  up() {
    let { playnum, songUrl, playList } = this.props.counter;
    let index = playnum - 1;
    // 重置
    if (index < 0) {
      index = songUrl.length - 1;
    }
    this.props.addRedux(index, 'addPlayNum');
    if (!songUrl[index] || songUrl[index].url === null || !songUrl[index].url) {
      this.up();
      return;
    }
    if (process.env.TARO_ENV === 'weapp') {
      let _obj = playList.playlist.tracks[index];
      Object.assign(this.innerAudioContext, {
        title: _obj.name,
        epname: _obj.ar[0].name,
        singer: _obj.al.name,
        coverImgUrl: _obj.al.picUrl,
        src: songUrl[index].url
      });
    } else {
      Object.assign(this.innerAudioContext, {
        src: songUrl[index].url
      });
    }
  }
  // 下一首
  down() {
    let { playnum, songUrl, playList } = this.props.counter;
    let index = playnum + 1;
    // 重置
    if (index >= songUrl.length) {
      index = 0;
    }
    this.props.addRedux(index, 'addPlayNum');
    if (!songUrl[index] || songUrl[index].url === null || !songUrl[index].url) {
      this.down();
      return;
    }
    if (process.env.TARO_ENV === 'weapp') {
      let _obj = playList.playlist.tracks[index];
      this.innerAudioContext = Object.assign(this.innerAudioContext, {
        title: _obj.name,
        epname: _obj.ar[0].name,
        singer: _obj.al.name,
        coverImgUrl: _obj.al.picUrl,
        src: songUrl[index].url
      });
    } else {
      Object.assign(this.innerAudioContext, {
        src: songUrl[index].url
      });
    }
  }
  handleChange(val) {
    this.setState({
      isOpened: val
    });
  }
  render() {
    let { songUrl, playList, playnum } = this.props.counter;
    return (
      <View className="play fixed">
        {songUrl.length ? (
          <View className="main">
            <Image
              src={playList.playlist.tracks[playnum].al.picUrl}
              mode="widthFix"
              className={this.state.type ? 'img animation-running' : 'img animation-paused'}
            ></Image>
            <View className="info">
              <Text>{playList.playlist.tracks[playnum].name}</Text>
              <Text>
                {playList.playlist.tracks[playnum].ar[0].name} - {playList.playlist.tracks[playnum].al.name}
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
              <View onClick={this.handleChange.bind(this, true)}>
                <IconFont name="genduo" size="60" />
              </View>
            </View>
            <AtFloatLayout isOpened={this.state.isOpened} className="playatfloatlayout" title="列表" onClose={this.handleChange.bind(this, false)}>
              <AtList>
                {playList.playlist.tracks.map((r, i) => {
                  return <AtListItem thumb={r.al.picUrl} title={r.name + ' - ' + r.ar[0].name} key={r.name + i} extraText={r.al.name}/>;
                })}
              </AtList>
            </AtFloatLayout>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    );
  }
}
export default Play;
