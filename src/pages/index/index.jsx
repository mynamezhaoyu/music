import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import Header from '../../components/header/header';
import Personalized from '../../components/personalized/personalized';
import './index.scss';
import http from '../../services/api';
import { connect } from '@tarojs/redux';
import { addBanner } from '../../actions/counter';
@connect(
  ({ counter }) => ({
    counter
  }),
  (dispatch) => ({
    addBanner(val) {
      dispatch(addBanner(val));
    }
  })
)
export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  };
  constructor(props) {
    super(props);
    this.state = { banners: [] };
  }
  componentDidShow() {}
  componentDidMount() {
    this.fun.getData();
  }
  fun = {
    getData: () => {
      http
        .post('banner', {
          type: 2
        })
        .then((res) => {
          this.setState({
            banners: res.data.banners
          });
          this.props.addBanner(res.data.banners)
        });
    }
  };
  render() {
    return (
      <View className="index">
        <Header></Header>
        <Personalized></Personalized>
      </View>
    );
  }
}
