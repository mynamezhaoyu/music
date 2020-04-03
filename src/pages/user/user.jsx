import Taro, { useState, useDidShow, useEffect,useLayoutEffect } from '@tarojs/taro';
import { View,Text } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import UserHeader from '../../components/header/userHeader';
import './user.scss';
/* 
搜索页
date: 2020-03-04
*/
function User() {
  let login = () => {
    Taro.navigateTo({
      url: '/pages/login/login'
    })
  }
  useLayoutEffect(() => {
    console.log(1);
  }, [])
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
