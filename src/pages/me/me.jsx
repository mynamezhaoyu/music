import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import UserHeader from '../../components/header/userHeader';
import http from '../../services/api';
import './me.scss';
import moment from '../../common/js/moment';
export default class User extends Component {
  config = {
    navigationBarTitleText: '账号'
  };
  constructor(props) {
    super(props);
    this.state = {
      userDetail: {},
      singinDisabled: false
    };
  }
  fun = {
    login() {
      Taro.navigateTo({
        url: '/pages/login/login'
      });
    },
    async signin() {
      // https://music.163.com/weapi/point/dailyTask
      http.get(`daily_signin?type=1&timestamp=${new Date()}`).then((res) => {
        if (res.data.code !== 200) return;
        Taro.showToast({
          title: '签到成功'
        });
        Taro.setStorage({
          key: 'daily_signin',
          data: {
            date: moment().format('YYYY-MM-DD')
          }
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
          userDetail: {}
        });
      });
    }
  };
  componentDidMount() {
    // 整个页面只需要执行一次的时候用这个
  }
  componentDidShow() {
    this.getStatus();
  }
  async getStatus() {
    let [data, isSingin] = [{}];
    try {
      isSingin = await Taro.getStorage({
        key: 'daily_signin',
        fail: () => {}
      });
    } catch (err) {}
    // 如果是isSingin undefined证明第一次用
    if (isSingin && !moment(isSingin.data.date).isBefore(moment().format('YYYY-MM-DD'), 'day')) {
      this.setState({ singinDisabled: true });
    }
    await Taro.getStorage({
      key: 'userData',
      success: (res) => {
        data = { ...{ userData: res.data, userId: res.data.profile.userId } };
      },
      fail: () => {
        Taro.showToast({
          title: '登录体验更多功能',
          icon: 'none'
        });
      }
    });
    // 如果cooking没有里没有用户信息，不调取接口了
    if (!Object.keys(data.userData).length) return;
    http.get(`user/detail?uid=${data.userId}`).then((res) => {
      this.setState({ userDetail: res.data });
    });
  }
  render() {
    const { userDetail } = this.state;
    return (
      <View className="user">
        <UserHeader></UserHeader>
        {!Object.keys(userDetail).length && (
          <View className="login">
            <View className="login-title">手机电脑多段同步，尽享海量高品质音乐</View>
            <AtButton type="primary" size="small" circle className="login-button theme-button" onClick={this.fun.login.bind(this)}>
              立即登录
            </AtButton>
          </View>
        )}
        {Object.keys(userDetail).length ? (
          <View className="info">
            <View className="header">
              <View className="box">
                <Image src={userDetail.profile.avatarUrl} mode="widthFix" className="user-img"></Image>
                <View className="name">
                  <View>{userDetail.profile.nickname}</View>
                  <View className="level">Lv.{userDetail.level}</View>
                </View>
              </View>
              <AtButton
                type="primary"
                size="small"
                circle
                className="theme-button m-0"
                onClick={this.fun.signin.bind(this)}
                disabled={this.state.singinDisabled}
              >
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
