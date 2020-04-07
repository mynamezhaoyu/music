import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './login.scss';
import { AtInput, AtForm, AtButton } from 'taro-ui';
import logo from '../../common/img/fm/logo.png';
/* 
搜索页
date: 2020-03-04
*/
function Login() {
  const goback = () => {
    Taro.navigateBack({ delta: 1 });
  };
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loginDisabled, setLoginDisabled] = useState(true);
  const phoneChange = (val) => {
    setPhone(val);
  };
  const passwordChange = (val) => {
    setPassword(val);
    phone.length === 11 && val.length > 6 ? setLoginDisabled(false) : setLoginDisabled(true);
  };
  const login = () => {
    Taro.request({
      url: 'https://www.wwxinmao.top/music/banner?type=2',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json'
      }
    }).then((res) => {
      console.log(res);
    });
  };
  return (
    <View className="login">
      <View className="box">
        <Image src={logo} mode="aspectFit" className="img" onClick={goback} />
      </View>
      <AtForm className="login-form">
        <AtInput name="value1" title="账号" type="phone" placeholder="请输入手机号码" value={phone} onChange={phoneChange} focus={true} />
        <AtInput name="password" title="密码" type="password" placeholder="请输入密码" value={password} onChange={passwordChange} border={false} />
      </AtForm>
      <AtButton type="secondary" circle className="login-button" disabled={loginDisabled} onClick={login}>
        登录
      </AtButton>
    </View>
  );
}
export default Login;
