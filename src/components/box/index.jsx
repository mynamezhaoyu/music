import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Play from '../../components/play/index';
@connect(({ counter }) => ({
  counter
}))
class Header extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // 整个页面只需要执行一次的时候用这个
  }
  render() {
    return (
      <View className="box">
        {this.props.children}
        {process.env.TARO_ENV === 'h5' ? this.props.counter.songUrl.length ? <Play /> : '' : <Play />}
      </View>
    );
  }
}
export default Header;
