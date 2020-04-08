import Taro from '@tarojs/taro';
const onError = (title) => {
  Taro.showToast({
    title: title,
    icon: 'none'
  });
};
export default {
  baseOptions(params, method = 'GET') {
    let cookie = Taro.getStorageSync('cookies');
    let { url, data } = params;
    let contentType = 'application/json';
    contentType = params.contentType || contentType;

    const setCookie = (res) => {
      if (res.data.cookie && res.data.cookie.length > 0) {
        Taro.clearStorage();
        let cookies = '';
        res.data.cookie.forEach((cookie, index) => {
            cookies += `${cookie};`;
        });
        Taro.setStorageSync('cookies', cookies);
      }
    };
    const option = {
      url: 'https://www.wwxinmao.top/music/' + url,
      data: data,
      method: method,
      credentials: 'include',
      header: {
        'content-type': contentType
      },
      xhrFields: { withCredentials: true },
      success(res) {
        // console.log('res', res)
        setCookie(res);
        if (res.data.code === 200) {
          return res.data;
        }
        if (res.data.code === 301) {
          Taro.clearStorage();
          Taro.navigateTo({
            url: '/pages/login/login'
          });
          onError('请先登录');
          return;
        }
        onError(res.data.message);
      },
      error() {
        onError('请求接口出现问题');
      }
    };
    return Taro.request(option);
  },
  get(url, data) {
    let option = { url, data };
    return this.baseOptions(option);
  },
  post(url, data, contentType) {
    let params = { url, data, contentType };
    return this.baseOptions(params, 'POST');
  }
};
