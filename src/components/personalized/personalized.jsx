import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './personalized.scss';
import IconFont from '../iconfont';
@connect(({ counter }) => ({
  counter
}))
class Personalized extends Component {
  render() {
    return (
      <View className="personalized">
        <View className="title">推荐歌单</View>
        <View className="slogan">为你精挑细选</View>
        <ScrollView scrollX="true" scrollAnchoring="true" className="person-scroll">
          {this.props.counter.personalized.map((r, i) => {
            return (
              <View className="list" key={r.name + i}>
                <View className="item">
                  <Image src={r.picUrl} className="img"></Image>
                  <View className="icon">
                    <IconFont name="bofang1" size="40" />
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
export default Personalized;
