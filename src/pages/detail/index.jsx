import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import './index.scss';
import http from '../../services/api';
import { connect } from '@tarojs/redux';
import { addRedux } from '../../actions/counter';
import { AtIcon } from 'taro-ui';
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
class Detail extends Component {
  config = {
    navigationBarTitleText: '详情',
    navigationStyle: 'custom',
    disableScroll: true
  };
  constructor(props) {
    super(props);
    this.state = {
      num: 0
    };
  }
  componentDidMount() {
    this.setState({
      num: Taro.$navBarMarginTop
    });
    Taro.eventCenter.on('boxTrigger', () => {
      console.log(1);
    });
  }
  componentDidShow() {}
  getSongDetail() {}
  goback() {
    console.log(1);
    Taro.navigateBack({ delta: 1 });
  }
  render() {
    return (
      <View className="detail" style={{ paddingTop: [`${this.state.num}PX`] }}>
        <View className="navbar">
          <View onClick={this.goback.bind(this)} className="leftIcon">
            <AtIcon value="chevron-left" size="30" color="#fff"></AtIcon>
          </View>
          <View className="header">
            <View className="title">歌曲详情</View>
            <View className="singer">
              <Text>我是歌手</Text>
              <AtIcon value="chevron-right" size="15" color="#fff"></AtIcon>
            </View>
          </View>
          <View className="rightIcon"></View>
        </View>
        <View className="box">
          <Image src={require('../../common/img/aag.png')} className="aag" />
          <Image src={require('../../common/img/play.png')} className="play" />
        </View>
        <View className="footer"></View>
      </View>
    );
  }
}
export default Detail;
