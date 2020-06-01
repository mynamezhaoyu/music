import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './personalized.scss';
import IconFont from '../iconfont';
import http from '../../services/api';
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
class Personalized extends Component {
  async play(val) {
    this.props.handleClickplay(val)
  }
  async playList(val) {
    let data = await http.get('playlist/detail', {
      id: val.id,
      timestamp: new Date()
    });
    this.props.addRedux(data.data, 'addPlayList');
    Taro.navigateTo({
      url: '/pages/list/index'
    });
  }
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
                  <Image src={r.picUrl} className="img" onClick={this.playList.bind(this, r)}></Image>
                  <View className="icon" onClick={this.play.bind(this, r)}>
                    <IconFont name="bofang" size="40" />
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
