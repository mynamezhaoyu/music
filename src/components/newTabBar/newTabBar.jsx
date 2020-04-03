import Taro, { useState, useDidShow, useEffect } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTabBar } from 'taro-ui';
import './newTabBar.scss';
/* 
搜索页
date: 2020-03-04
*/
function NewTabBar(props) {
  const arr = ['index', 'user'];
  const goToNewPage = (val) => {
    Taro.navigateTo({
      url: `/pages/${arr[val]}/${arr[val]}`
    });
  };
  return (
    <View className="newTabBar">
      <AtTabBar
        fixed
        current={Number(props.count)}
        backgroundColor="#484848"
        color="#fff"
        selectedColor="#e61607"
        tabList={[
          {
            title: '发现',
            image: require('../../common/img/cm2_btm_icn_discovery.png'),
            selectedImage: require('../../common/img/cm2_btm_icn_discovery_prs.png')
          },
          {
            title: '账号',
            image: require('../../common/img/cm2_btm_icn_account.png'),
            selectedImage: require('../../common/img/cm2_btm_icn_account_prs.png')
          }
        ]}
        onClick={goToNewPage}
      />
    </View>
  );
}
export default NewTabBar;
