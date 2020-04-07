import Taro, { useState, useEffect, useShareAppMessage, usePullDownRefresh } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import Header from '../../components/header/header';
import NewTabBar from '../../components/newTabBar/newTabBar';
import './index.scss';
/* 
首页
date: 2020-02-25
*/
function Index() {
  const [isOpened, setIsOpened] = useState(false);
  // 更新机制
  usePullDownRefresh(() => {
    console.log('你下拉了刷新');
  });
  if (process.env.TARO_ENV === 'weapp') {
    useShareAppMessage(() => {
      return {
        title: '你的好友为你分享了轻云音乐',
        path: 'pages/index/index'
      };
    });
  }
  return (
    <View className="index">
      <AtToast isOpened={isOpened} text="检测到有新版本，即将自动更新"></AtToast>
      <Header></Header>
      {/* <NewTabBar count='0'></NewTabBar> */}
    </View>
  );
}
export default Index;
Index.config = {
  navigationBarTitleText: '首页',
};
