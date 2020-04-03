Component({
  properties: {
    // set | rise | duoyun | yintian | leizhenyubanyoubingbao | qiangshachenbao | shachenbao | tianqi-teqiangnongwu | lan-dawu | dongyu | tedabaoyu | tedabaoyu-D | zhongdumai | zhongdumai1 | yanzhongmai | fuchen | zhenxue | qingtian | manyue | shaoyun | canyue | baoyu | dayu | baoxue | daxue | dayuzhuanqing | duoyunzhuanqingtian | leizhenyu | emeiyue | shandian | shangxianyue | wanduoyun | wanqingtian | wumai | wu | tedazhenyu | xiaxianyue | xiaoxue | xiaoyu | xinyue | zhenyu | zhenyuzhuanqing | yujiaxue | zhongxue | zhongyu | zhangxianyue | Group1
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          colors: this.fixColor(),
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 18,
      observer: function(size) {
        this.setData({
          svgSize: size / 750 * wx.getSystemInfoSync().windowWidth,
        });
      },
    },
  },
  data: {
    colors: '',
    svgSize: 18 / 750 * wx.getSystemInfoSync().windowWidth,
    quot: '"',
    isStr: true,
  },
  methods: {
    fixColor: function() {
      var color = this.data.color;
      var hex2rgb = this.hex2rgb;

      if (typeof color === 'string') {
        return color.indexOf('#') === 0 ? hex2rgb(color) : color;
      }

      return color.map(function (item) {
        return item.indexOf('#') === 0 ? hex2rgb(item) : item;
      });
    },
    hex2rgb: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    }
  }
});
