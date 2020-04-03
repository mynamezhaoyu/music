import Taro, { useState, useDidShow, useEffect } from '@tarojs/taro';
import { Text, View, Swiper, SwiperItem, Image } from '@tarojs/components';
import { AtNavBar, AtSearchBar } from 'taro-ui';
import common from '../../common/js/common';
import './header.scss';
/* 
搜索页
date: 2020-03-04
*/
function Header() {
  // 搜索框数据
  let [inputVal, setInputVal] = useState('');
  let [banners, setBanners] = useState([]);
  useEffect(() => {
    Taro.request({
      url: 'https://www.wwxinmao.top/music/banner?type=2',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json'
      }
    }).then((res) => {
      setBanners(res.data.banners);
    });
  }, []);
  return (
    <View className="header">
      <AtNavBar color="#000" leftText="" rightFirstIconType="sound">
        <AtSearchBar actionName="取消" value={inputVal} />
      </AtNavBar>

      <View className="banner">
        <Swiper indicatorColor="#fff" indicatorActiveColor="red" circular={true} indicatorDots autoplay>
          {banners.map((r) => {
            return (
              <SwiperItem>
                <Image src={r.pic} className="banner-img"></Image>
                <View style={{ backgroundColor: r.titleColor }} className="icon">
                  {r.typeTitle}
                </View>
              </SwiperItem>
            );
          })}
        </Swiper>
      </View>
    </View>
  );
}
export default Header;
