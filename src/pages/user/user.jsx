import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import UserHeader from '../../components/header/userHeader';
import http from '../../services/api';
import { connect } from '@tarojs/redux';
import { userInfo, asyncAdd } from '../../actions/counter';
import './user.scss';
@connect(
  ({ counter }) => ({
    counter
  }),
  (dispatch) => ({
    userInfo(val) {
      dispatch(userInfo(val));
    },
    asyncAdd() {
      dispatch(asyncAdd());
    }
  })
)
export default class User extends Component {
  config = {
    navigationBarTitleText: '账号'
  };
  constructor(props) {
    super(props);
    this.state = {
      userData: Taro.getStorageSync('userData'),
      userId: Taro.getStorageSync('userId')
    };
  }
  fun = {
    login() {
      Taro.navigateTo({
        url: '/pages/login/login'
      });
    },
    signin() {
      http.get('daily_signin').then((res) => {
        Taro.showToast({
          title: '签到成功'
        });
      });
    },
    logout() {
      http.get(`logout?timestamp=${new Date()}`).then((res) => {
        Taro.showToast({
          title: '退出成功'
        });
        Taro.clearStorage();
        this.setState({
          userData: {}
        });
      });
    }
  };
  componentDidMount() {
    // 整个页面只需要执行一次的时候用这个
  }
  getStatus() {
    // 如果cooking没有里没有用户信息，不调取接口了
    if (!Object.keys(this.state.userData).length) return;
    http.get(`user/detail?uid=${this.state.userId}`).then((res) => {
      console.log(res.data);
    });
    http.get(`user/subcount?uid=${this.state.userId}`).then((res) => {
      console.log(res.data);
    });
  }
  componentDidShow() {
    this.getStatus();
  }
  render() {
    const userData = this.state.userData;
    return (
      <View className="user">
        <UserHeader></UserHeader>
        {!Object.keys(userData).length && (
          <View className="login">
            <View className="login-title">手机电脑多段同步，尽享海量高品质音乐</View>
            <AtButton type="primary" size="small" circle className="login-button theme-button" onClick={this.fun.login.bind(this)}>
              立即登录
            </AtButton>
          </View>
        )}
        {Object.keys(userData).length ? (
          <View className="info">
            <View className="header">
              <View className="box">
                <Image src={userData.profile.avatarUrl} mode="widthFix" className="user-img"></Image>
                <View className="ml-20">{userData.profile.nickname}</View>
              </View>
              <AtButton type="primary" size="small" circle className="theme-button m-0" onClick={this.fun.signin.bind(this)}>
                签到
              </AtButton>
            </View>
            <AtButton type="primary" size="small" circle className="theme-button logout" onClick={this.fun.logout.bind(this)}>
              退出登录
            </AtButton>
          </View>
        ) : (
          ''
        )}
      </View>
    );
  }
}
