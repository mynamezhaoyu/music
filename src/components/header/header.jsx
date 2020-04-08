import Taro, { useState, useDidShow, useEffect } from '@tarojs/taro';
import { Text, View, Swiper, SwiperItem, Image } from '@tarojs/components';
import { AtNavBar, AtSearchBar } from 'taro-ui';
import './header.scss';
import http from '../../services/api'
/* 
搜索页
date: 2020-03-04
*/
function Header() {
  // 搜索框数据
  let [inputVal, setInputVal] = useState('');
  let [banners, setBanners] = useState([]);
  useEffect(() => {
    http.post('banner',{
      type: 2
    }).then((res) => {
      setBanners(res.data.banners);
    });
  }, []);
  return (
    <View className="header">
      <AtSearchBar actionName="取消" value={inputVal} className="header-search" />
      <View className="banner">
        <Swiper indicatorColor="#fff" indicatorActiveColor="red" circular={true} indicatorDots autoplay className="header-swiper">
          {banners.map((r) => {
            return (
              <SwiperItem>
                <Image src={r.pic} className="banner-img"></Image>
                <View style={{ backgroundColor: r.titleColor === 'blue' ? '#4040c1': '#e61607',color: '#fff' }} className="icon">
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
