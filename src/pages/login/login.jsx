import Taro, { useState, useDidShow, useEffect, useCallback } from '@tarojs/taro';
import { Text, View, Swiper, SwiperItem, Image } from '@tarojs/components';
import './login.scss';
import logo from '../../common/img/fm/cm2_default_cover_fm-ip6@2x.png';
/* 
搜索页
date: 2020-03-04
*/
function Login() {
  let [a, setA] = useState(false);
  useEffect(() => {
    console.log('登录页面');
  }, [a]);
  const test = () => {
    Taro.navigateBack({ delta: 1 });
  };
  return (
    <View className="login">
      <Image src={logo} className="img" mode="widthFix" onClick={test} />
    </View>
  );
}
export default Login;
