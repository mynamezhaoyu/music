import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
@connect(({ counter }) => ({
  counter
}))
export default class Personalized extends Component {
  render() {
    return (
      <View className="test">1
      </View>
    );
  }
}
