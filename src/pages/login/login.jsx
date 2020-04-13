import './login.scss';
import { AtInput, AtForm, AtButton } from 'taro-ui';
import logo from '../../common/img/fm/logo.png';
import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import http from '../../services/api';

export default class Login extends Component {
  config = {
    navigationBarTitleText: '登录'
  };
  constructor(props) {
    super(props);
    this.state = {
      phone: '13370229059',
      password: 'ZyHly517421',
      loginDisabled: false
    };
  }
  fun = {
    goback() {
      Taro.navigateBack({ delta: 1 });
    },
    phoneChange(val) {
      this.setState({
        phone: val
      });
    },
    passwordChange(val) {
      const pk = this.state.phone.length === 11 && val.length > 6 ? false : true;
      this.setState({
        password: val,
        loginDisabled: pk
      });
    },
    login() {
      Taro.clearStorage();
      http.get(`login/cellphone?phone=${this.state.phone}&password=${this.state.password}&timestamp=${new Date()}`).then((res) => {
        if (res.code === 502) {
          Taro.showToast({
            title: res.msg || ''
          });
          return;
        }
        Taro.showToast({
          title: '登陆成功',
          icon: 'success'
        });
        Taro.setStorageSync('user_id', res.data.account.id);
        this.fun.goback();
      });
    }
  };
  componentDidMount() {}
  render() {
    return (
      <View className="login">
        <View className="box">
          <Image src={logo} mode="aspectFit" className="img" onClick={this.fun.goback.bind(this)} />
        </View>
        <AtForm className="login-form">
          <AtInput
            name="value1"
            title="账号"
            type="number"
            placeholder="请输入手机号码"
            value={this.state.phone}
            onChange={this.fun.phoneChange.bind(this)}
            maxLength={11}
            focus={true}
          />
          <AtInput
            name="password"
            title="密码"
            type="password"
            placeholder="请输入密码"
            value={this.state.password}
            onChange={this.fun.passwordChange.bind(this)}
            border={false}
            maxLength={140}
          />
        </AtForm>
        <AtButton type="secondary" circle className="login-button" disabled={this.state.loginDisabled} onClick={this.fun.login.bind(this)}>
          登录
        </AtButton>
      </View>
    );
  }
}
