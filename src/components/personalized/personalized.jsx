import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './personalized.scss';
@connect(({ counter }) => ({
  counter
}))
export default class Personalized extends Component {
  render() {
    return (
      <ScrollView scrollX="true" scrollAnchoring="true" className="person-scroll">
        <View className="title">为你精挑细选</View>
        {this.props.counter.personalized.map((r) => {
          return (
            <View className="list">
              <Image src={r.picUrl} className="img"></Image>
            </View>
          );
        })}
      </ScrollView>
    );
  }
}
