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
      let dailySigninData;
      // https://music.163.com/weapi/point/dailyTask
      try {
        dailySigninData = await http.get(`daily_signin?type=1&timestamp=${new Date()}`);
      } catch (error) {}
      Taro.setStorage({
        key: 'daily_signin',
        data: moment().format('YYYY-MM-DD')
      });
      this.setState({ singinDisabled: true });
      if (dailySigninData) {
        Taro.showToast({
          title: '签到成功'
        });
      }
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
    let [userId, userDate, userData, isSingin] = [];
    try {
      // userId 在登陆的时候就存在了conking里面了
      userId = await Taro.getStorage({
        key: 'user_id',
        fail: () => {}
      });
      // 上次掉接口调用user_data是什么时间
      userDate = await Taro.getStorage({
        key: 'user_date',
        fail: () => {}
      });
      // 取存的user_data 数据
      userData = await Taro.getStorage({
        key: 'user_data',
        fail: () => {}
      });
      // 取签到信息
      isSingin = await Taro.getStorage({
        key: 'daily_signin',
        fail: () => {}
      });
    } catch (e) {}
    // 如果连userId都没拿到，证明根本没登陆过
    if (!userId) {
      Taro.showToast({
        title: '登录体验更多功能',
        icon: 'none'
      });
      return;
    }
    // 没有，或者有但是过期了。都重新调用接口
    if (!userData || (userData && moment(userDate.data).isBefore(moment().format('YYYY-MM-DD'), 'day'))) {
      userData = await http.get(`user/detail?uid=${userId.data}`);
      // 取用户信息如果存在，存到数据中。并更新
      if (userData) {
        Taro.setStorage({
          key: 'user_date',
          data: moment().format('YYYY-MM-DD')
        });
        Taro.setStorage({
          key: 'user_data',
          data: userData.data
        });
      } else {
        Taro.showToast({
          title: '登陆信息过期，请重新登录',
          icon: 'none'
        });
        return;
      }
    }
    this.setState({ userDetail: userData.data });
    // 如果是isSingin undefined证明第一次用签到
    if (isSingin && !moment(isSingin.data).isBefore(moment().format('YYYY-MM-DD'), 'day')) {
      this.setState({ singinDisabled: true });
    } else {
      this.setState({ singinDisabled: false });
    }
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
