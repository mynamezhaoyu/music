import Taro, { useState, useDidShow, useEffect } from '@tarojs/taro';
import { Text, View, Swiper, SwiperItem, Image } from '@tarojs/components';
import './me.scss';
/* 
搜索页
date: 2020-03-04
*/
function Me() {
  useEffect(() => {
    console.log(1);
  }, [])
  return <View className="Me"></View>;
}
export default Me;
