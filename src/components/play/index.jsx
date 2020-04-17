import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import IconFont from '../iconfont';
import './index.scss';
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
      isOpened: false,
      floatLayout: false,
      num: 1
    };
  }
  componentDidMount() {
    Taro.eventCenter.on('playMusic', () => {
      this.play();
    });
  }
  componentDidShow() {}
  // 初始化播放
  async play() {
    this.setState({
      floatLayout: false,
      num: 1
    });
    let { playnum, songUrl, playList } = this.props.counter;
    // 因为微信小程序具备后台播放的功能。所以配置的参数不同
    let musicData = {};
    if (process.env.TARO_ENV === 'weapp') {
      let _obj = playList.playlist.tracks[playnum];
      musicData = {
        title: _obj.name,
        epname: _obj.ar[0].name,
        singer: _obj.al.name,
        coverImgUrl: _obj.al.picUrl,
        src: songUrl[playnum].url
      };
    } else {
      musicData = {
        autoplay: true,
        src: songUrl[playnum].url
      };
    }
    await this.props.addRedux(musicData, 'updateAudioContext');
    // 监听播放完了，接着放下一首
    this.props.counter.audioContext.onEnded(() => {
      this.down();
      Taro.eventCenter.trigger('down');
    });
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
    if (this.state.num * 10 < this.props.counter.playList.playlist.tracks.length) {
      this.setState({
        num: this.state.num + 1
      });
    }
  }
  changePlaynum(i) {
    let { songUrl, playList } = this.props.counter;
    let musicData = {};
    this.props.addRedux(i, 'addPlayNum');
    let _obj = playList.playlist.tracks[i];
    musicData =
      process.env.TARO_ENV === 'weapp'
        ? {
            title: _obj.name,
            epname: _obj.ar[0].name,
            singer: _obj.al.name,
            coverImgUrl: _obj.al.picUrl,
            src: songUrl[i].url
          }
        : {
            src: songUrl[i].url
          };
    this.props.addRedux(musicData, 'updateAudioContext');
  }
  onClickImg() {
    Taro.eventCenter.trigger('boxTrigger');
    Taro.navigateTo({
      url: '/pages/detail/index'
    });
  }
  getTime(i) {
    let { playList } = this.props.counter;
    let time = playList.playlist.tracks[i].dt / 60000;
    let arr = [time - (time % 1), parseInt((time % 1) * 60)];
    return `${arr[0] < 10 ? '0' + arr[0] : arr[0]}: ${arr[1] < 10 ? '0' + arr[1] : arr[1]}`;
  }
  render() {
    let { songUrl, playList, playnum, musicType } = this.props.counter;
    return (
      <View className="play fixed">
        {songUrl.length ? (
          <View className="main">
            <Image
              onClick={this.onClickImg}
              src={playList.playlist.tracks[playnum].al.picUrl}
              mode="widthFix"
              className={musicType ? 'img animation-running' : 'img animation-paused'}
            ></Image>
            <View className="info">
              <Text>{playList.playlist.tracks[playnum].name}</Text>
              <Text>
                {playList.playlist.tracks[playnum].ar[0].name} - {playList.playlist.tracks[playnum].al.name}
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
                  title={`当前播放 ${songUrl.length}`}
                  onClose={this.handleChange.bind(this, false)}
                >
                  <ScrollView
                    scrollY
                    scrollWithAnimation
                    scrollAnchoring
                    onScrollToLower={this.onScrollToLower.bind(this)}
                    style={{ height: ['300px'] }}
                  >
                    <AtList>
                      {playList.playlist.tracks.map((r, i) => {
                        if (i < this.state.num * 10)
                          return (
                            <AtListItem
                              className={i === playnum ? 'listActive' : ''}
                              thumb={r.al.picUrl}
                              disabled={songUrl[i].url ? false : true}
                              title={r.name + ' - ' + r.ar[0].name}
                              key={r.name + i}
                              extraText={this.getTime(i)}
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
          ''
        )}
      </View>
    );
  }
}
export default Play;
