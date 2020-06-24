import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Play from "../../components/play/index";
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
    let [songList] = [this.props.counter.songList];
    return (
      <View className="box">
        {this.props.children}
        {/* h5 单独判断，必须先有值再渲染，不然会报错 */}
        {process.env.TARO_ENV === "h5" ? (
          songList && songList.url.length ? (
            <Play />
          ) : (
            ""
          )
        ) : (
          <Play />
        )}
      </View>
    );
  }
}
export default Header;
