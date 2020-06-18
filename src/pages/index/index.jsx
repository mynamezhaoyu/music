import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import Header from "../../components/header/header";
import Personalized from "../../components/personalized/personalized";
import "./index.scss";
import http from "../../services/api";
import common from "../../common/js/common";
import { connect } from "@tarojs/redux";
import { addRedux } from "../../actions/counter";
import Box from "../../components/box/index";
@connect(
  ({ counter }) => ({
    counter
  }),
  dispatch => ({
    addRedux(val, type) {
      dispatch(addRedux(val, type));
    }
  })
)
class Index extends Component {
  config = {
    navigationBarTitleText: "首页"
  };

  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidShow() {}
  componentDidMount() {
    if (!this.props.counter.banner.length) this.fun.getData();
  }
  fun = {
    getData: () => {
      // 请求banner数据
      http
        .post("banner", {
          type: 2
        })
        .then(res => {
          this.props.addRedux(res.data.banners, "addBanner");
        });
      // 请求推荐歌单数据
      http.get("personalized?limit=10").then(res => {
        this.props.addRedux(res.data.result, "addPersonalized");
      });
    },
    async handleClickplay(val) {
      let arr = await common.play(val.id);
      // 存到redux
      this.props.addRedux(arr[0], "addPlayList");
      this.props.addRedux(arr[1], "addSongUrl");
      await this.props.addRedux(arr[2], "addPlayNum");
      Taro.eventCenter.trigger("playMusic");
    }
  };
  render() {
    return (
      <View className="index">
        <Box>
          <Header></Header>
          <Personalized
            handleClickplay={this.fun.handleClickplay.bind(this)}
          ></Personalized>
        </Box>
      </View>
    );
  }
}
export default Index;
