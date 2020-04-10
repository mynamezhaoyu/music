import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import Header from '../../components/header/header';
import Personalized from '../../components/personalized/personalized';
import './index.scss';
import http from '../../services/api';
import { connect } from '@tarojs/redux';
import { addRedux } from '../../actions/counter';
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
export default class Index extends Component {
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
    }
  };
  render() {
    return (
      <View className="index">
        <Header></Header>
        <Personalized></Personalized>
        <IconFont name='bofang1' size="40" />
      </View>
    );
  }
}
