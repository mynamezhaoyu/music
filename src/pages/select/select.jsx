import Taro, { useState, useDidShow } from '@tarojs/taro';
import { Text, View } from '@tarojs/components';
import { AtSearchBar, AtList, AtListItem, AtIcon } from 'taro-ui';
import common from '../../common/js/common';
import './select.scss';
/* 
搜索页
date: 2020-03-04
*/
function Cselect() {
  // 搜索框数据
  let [inputVal, setInputVal] = useState('');
  // 搜索结果列表
  let [arr, setArr] = useState([]);
  // 历史记录数据
  let [logArr, setLogArr] = useState([]);
  // 切换搜索结果，历史记录列
  let [isShow, setIsShow] = useState(true);
  // 第一次进入查找有没有历史记录
  useDidShow(() => {
    try {
      var value = Taro.getStorageSync('logData');
      if (value) {
        setLogArr(Array.from(new Set(value)));
      }
    } catch (e) {
      setLogArr([]);
    }
  });
  const obj = {
    timer: null,
    // 搜索框输入事件
    onChange(val) {
      if (!val.trim()) return;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        Taro.request({
          url: common.ajax('selWeather'),
          method: 'POST',
          data: {
            city: val
          },
          header: {
            'content-type': 'application/json'
          }
        }).then((res) => {
          let data = res.data.item;
          if (Object.keys(data.internal).length) {
            setInputVal(val);
            setArr(Object.values(data.internal));
          }
        });
      }, 300);
    },
    // 点击取消按钮，返回上一页
    onActionClick() {
      Taro.navigateBack();
      // 明确的要求不要刷新
      Taro.setStorage({
        key: 'isRefresh',
        data: true
      });
    },
    // 选中事件
    handleClick(i) {
      let _arr = logArr;
      // arr[i] 当前选中数据， _arr 取得的历史数据  //把当前数据插入历史数据
      _arr.unshift(arr[i]);
      // 只要最新的三个
      if (_arr.length > 3) _arr.length--;
      setLogArr(_arr);
      Taro.setStorage({
        key: 'logData',
        data: _arr
      });
      Taro.setStorage({
        key: 'active',
        data: _arr[0].split(',')
      });
      // 清除操作
      setArr([]);
      setInputVal('');
      setIsShow(true);
      Taro.navigateBack();
    }
  };
  return (
    <View className="select">
      <AtSearchBar
        value={inputVal}
        onChange={obj.onChange}
        onActionClick={obj.onActionClick}
        showActionButton
        actionName="取消"
        placeholder="搜索地区/景点"
        onFocus={() => {
          setIsShow(false);
        }}
        onBlur={() => {
          setIsShow(true);
        }}
      />
      {arr.map((r, i) => {
        return (
          <AtList key={i + ''}>
            <AtListItem title={r} onClick={obj.handleClick.bind(this, i)} />
          </AtList>
        );
      })}
      <View className="main" style={isShow ? { display: 'block' } : { display: 'none' }}>
        <View className="title">
          <Text>历史记录</Text>
          <AtIcon
            className={logArr.length ? '' : 'none'}
            value="trash"
            size="20"
            onClick={() => {
              Taro.setStorage({
                key: 'logData',
                data: []
              });
              setLogArr([]);
            }}
          ></AtIcon>
        </View>
        <View className="log">
          {logArr.map((r, i) => {
            return (
              <View
                key={i + ''}
                className="child"
                onClick={() => {
                  Taro.setStorage({
                    key: 'active',
                    data: r.split(',')
                  });
                  Taro.navigateBack();
                }}
              >
                {r.split(',')[r.split(',').length - 1]}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
export default Cselect;
