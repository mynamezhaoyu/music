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
      <View className="personalized">
        <View className="title">推荐歌单</View>
        <View className="slogan">为你精挑细选</View>
        <ScrollView scrollX="true" scrollAnchoring="true" className="person-scroll">
          {this.props.counter.personalized.map((r) => {
            return (
              <View className="list">
                <View className="item">
                  <Image src={r.picUrl} className="img"></Image>
                  <View className="icon">
                  </View>
                  <View className="playCount">{(r.playCount + '').length > 5 ? (r.playCount + ' ').slice(0, 3) + ' 万' : r.playCount}</View>
                </View>
                <View className="name">{r.name}</View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
