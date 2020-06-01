import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { connect } from "@tarojs/redux";
@connect(({ counter }) => ({
  counter
}))
class List extends Component {
  config = {
    navigationBarTitleText: "歌单"
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  componentWillMount() {}
  componentDidShow() {}
  render() {
    return (
      <View className="list">
        <View>123</View>
      </View>
    );
  }
}
export default List;
