import Taro, { useState, useDidShow, useEffect } from '@tarojs/taro';
import { Text, View, Swiper, SwiperItem, Image } from '@tarojs/components';
import { AtNavBar, AtSearchBar } from 'taro-ui';
import common from '../../common/js/common';
import namedPng from '../../common/img/fm/cm2_default_cover_fm-ip6@2x.png';
import './userHeader.scss';
/* 
员工头部
*/
function UserHeader() {
  return (
    <View className="userHeader">
      <Image src={namedPng} mode="widthFix" className="img" />
    </View>
  );
}
export default UserHeader;
