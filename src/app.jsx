import Taro, { Component } from '@tarojs/taro';
import { Provider } from '@tarojs/redux';
import configStore from './store';
import Index from './pages/index';
import 'taro-ui/dist/style/index.scss'; // 全局引入一次即可
import './app.scss';
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
const store = configStore;
class App extends Component {
  componentDidMount() {
    Taro.getSystemInfo({}).then((res) => {
      Taro.$navBarMarginTop = res.statusBarHeight || 0;
    });
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  config = {
    pages: ['pages/index/index', 'pages/me/me', 'pages/detail/index',  'pages/list/index', 'pages/login/login'],
    window: {
      navigationBarBackgroundColor: '#242424',
      navigationBarTitleText: '轻云音乐',
      backgroundColor: '#242424'
    },
    tabBar: {
      color: '#fff',
      selectedColor: '#e61607',
      backgroundColor: '#484848',
      list: [
        {
          pagePath: 'pages/index/index',
          iconPath: './common/img/cm2_btm_icn_discovery.png',
          selectedIconPath: './common/img/cm2_btm_icn_discovery_prs.png',
          text: '发现'
        },
        {
          pagePath: 'pages/me/me',
          iconPath: './common/img/cm2_btm_icn_music.png',
          selectedIconPath: './common/img/cm2_btm_icn_music_prs.png',
          text: '我的'
        }
      ]
    },
    permission: {
      // 'scope.userLocation': {
      //   desc: '欢迎使用轻天气，我们需要你授权地理位置信息！'
      // }
    },
    requiredBackgroundModes: ['audio']
  };

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
