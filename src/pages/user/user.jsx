import Taro, {useEffect} from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import UserHeader from '../../components/header/userHeader';
import http from '../../services/api';
import './user.scss';
/* 
搜索页
date: 2020-03-04
*/
function User() {
  useEffect(() => {
    httpUserInfo()
  }, [])
  let httpUserInfo = () => {
    http.get('login/status').then((res)=> {
      Taro.showToast({
        title: res.data.profile.nickname
      });
      console.log(res);
    })
  }
  let login = () => {
    Taro.navigateTo({
      url: '/pages/login/login'
    })
  }
  return (
    <View className="user">
      <UserHeader></UserHeader>
      <View className="login">
        <View className="login-title">手机电脑多段同步，尽享海量高品质音乐</View>
        <AtButton type="primary" size="small" circle className="login-button" onClick={login}>立即登录</AtButton>
      </View>
    </View>
  );
}
export default User;
