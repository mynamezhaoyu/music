import Taro, { Component } from "@tarojs/taro";
import { View, Swiper, SwiperItem, Image } from "@tarojs/components";
import "./header.scss";
import { common, http, addRedux, connect } from "../../common/js/export";
import Search from "../search/index";
@connect(({ counter }) => ({
  counter
}))
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: ""
    };
  }
  componentDidMount() {
    // 整个页面只需要执行一次的时候用这个
  }
  componentDidShow() {}
  render() {
    return (
      <View className="_header">
        <Search></Search>
        <View className="banner">
          <Swiper
            indicatorColor="#fff"
            indicatorActiveColor="red"
            circular={true}
            indicatorDots
            autoplay
            className="header-swiper"
          >
            {this.props.counter.banner.map((r, i) => {
              return (
                <SwiperItem key={r.pic + i}>
                  <Image src={common.img(r.pic)} className="banner-img"></Image>
                  <View
                    style={{
                      backgroundColor:
                        r.titleColor === "blue" ? "#4040c1" : "#e61607",
                      color: "#fff"
                    }}
                    className="icon"
                  >
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
}
export default Header;
