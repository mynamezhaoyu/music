import Taro from '@tarojs/taro';
export default {
  baseOptions(params, method = 'GET') {
    let { url, data } = params;
    let contentType = 'application/json';
    contentType = params.contentType || contentType;

    const setCookie = (res) => {
      if (res.cookies && res.cookies.length > 0) {
        let cookies = '';
        res.cookies.forEach((cookie, index) => {
          // windows的微信开发者工具返回的是cookie格式是有name和value的,在mac上是只是字符串的
          if (cookie.name && cookie.value) {
            cookies +=
              index === res.cookies.length - 1
                ? `${cookie.name}=${cookie.value};expires=${cookie.expires};path=${cookie.path}`
                : `${cookie.name}=${cookie.value};`;
          } else {
            cookies += `${cookie};`;
          }
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
      header: {
        'content-type': contentType,
        cookie: Taro.getStorageSync('cookies')
      },
      xhrFields: { withCredentials: true },
      success(res) {
        // console.log('res', res)
        setCookie(res);
        if (res.statusCode === 404) {
          Taro.showToast({
            title: '请求资源不存在'
          });
        } else if (res.statusCode === 502) {
          Taro.showToast({
            title: '服务端出现了问题'
          });
        } else if (res.statusCode === 403) {
          Taro.showToast({
            title: '没有权限访问'
          });
        } else if (res.statusCode === 301) {
          Taro.clearStorage();
          Taro.navigateTo({
            url: '/pages/login/index'
          });
          Taro.showToast({
            title: '请先登录'
          });
        } else if (res.statusCode === 200) {
          return res.data;
        }
      },
      error() {
        Taro.showToast({
          title: '请求接口出现问题'
        });
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
