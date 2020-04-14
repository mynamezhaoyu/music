import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import Header from '../../components/header/header';
import Personalized from '../../components/personalized/personalized';
import Play from '../../components/play/index';
import './index.scss';
import http from '../../services/api';
import { connect } from '@tarojs/redux';
import { addRedux } from '../../actions/counter';
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
class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidShow() {}
  componentDidMount() {
    if (!this.props.counter.banner.length) this.fun.getData();
  }
  fun = {
    getData: () => {
      http
        .post('banner', {
          type: 2
        })
        .then((res) => {
          this.props.addRedux(res.data.banners, 'addBanner');
        });
      http.get('personalized?limit=10').then((res) => {
        this.props.addRedux(res.data.result, 'addPersonalized');
      });
    },
    async handleClickplay(val) {
      let data = await http.get('playlist/detail', {
        id: val.id,
        timestamp: new Date()
      });
      let arr = data.data.playlist.trackIds.map((r) => r.id).join(',');
      let track = await http.get('song/url', {
        id: arr,
        timestamp: new Date()
      });
      //addPlayList addSongUrl
      this.props.addRedux(data.data, 'addPlayList');
      this.props.addRedux(
        arr.split(',').map((r) => track.data.data.filter((n) => Number(r) === Number(n.id))[0]),
        'addSongUrl'
      );
    }
  };
  render() {
    return (
      <View className="index">
        <Header></Header>
        <Personalized handleClickplay={this.fun.handleClickplay.bind(this)}></Personalized>
        <Play></Play>
      </View>
    );
  }
}
export default Index;
