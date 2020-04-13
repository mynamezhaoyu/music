import Taro from '@tarojs/taro';
const onError = (title) => {
  Taro.showToast({
    title: title,
    icon: 'none'
  });
};
export default {
  baseOptions(params, method = 'GET') {
    let { url, data } = params;
    let contentType = 'application/json';
    contentType = params.contentType || contentType;
    const setCookie = (res) => {
      if (res.cookies && res.cookies.length > 0) {
        let cookies = '';
        res.cookies.forEach((cookie, index) => {
          cookies += `${cookie};`;
        });
        Taro.setStorageSync('cookies', cookies);
      }
      if (res.header && res.header['Set-Cookie']) {
        Taro.setStorageSync('cookies', res.header['Set-Cookie']);
      }
    };
    const option = {
      url: 'https://www.wwxinmao.top/music/' + url,
      data: data,
      method: method,
      credentials: 'include',
      header: {
        'content-type': contentType,
        cookie: Taro.getStorageSync('cookies')
      },
      xhrFields: { withCredentials: true },
      success(res) {
        // console.log('res', res)
        setCookie(res);
        if (res.data.code === 200) {
          return res.data;
        }
        if (res.data.code === 301) {
          Taro.removeStorage('cookies');
          onError('请先登录');
          return;
        }
        onError(res.data.message || res.data.msg);
      },
      fail(err) {
        onError(err.statusText);
        return err;
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
