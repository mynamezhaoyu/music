import Taro, { Component } from "@tarojs/taro";
import { View, Swiper, SwiperItem, Image, Text } from "@tarojs/components";
import { AtSearchBar } from "taro-ui";
import "./index.scss";
import IconFont from "../iconfont";
import { common, http, addRedux, connect } from "../../common/js/export";
import classNames from "classnames";
@connect(({ counter }) => ({
  counter
}))
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: "",
      type: false,
      _data: []
    };
  }
  componentDidMount() {
    // 整个页面只需要执行一次的时候用这个
  }
  componentDidShow() {}
  change(v) {
    this.setState({
      inputVal: v
    });
  }
  async focus() {
    this.setState({
      type: true
    });
    if (!this.state._data.length) {
      let arr = await http.get("search/hot/detail");
      this.setState({
        _data: arr.data.data
      });
    }
  }
  getText(val) {
    let arr = [
      { type: 1, text: "HOT" },
      { type: 2, text: "NEW" },
      { type: 5, text: "↑" }
    ];
    let data = arr.filter(r => r.type === val);
    return data.length ? data[0].text : "";
  }
  async onChange(val) {
    let data = await http.get("search", {
      keywords: val.searchWord,
      type: 1018
    });
  }
  render() {
    const { type, _data } = this.state;
    return (
      <View className="_search">
        <AtSearchBar
          onChange={this.change.bind(this)}
          onFocus={this.focus.bind(this)}
          onActionClick={() => {
            this.setState({
              type: false
            });
          }}
          value={this.state.inputVal}
          actionName="取消"
          className="header-search"
        />
        <View className={classNames("top-view", type && "top-view-show")}>
          <View className="title">
            <View>搜索历史</View>
            <IconFont name="huishou" size="60" />
          </View>
          <View></View>
          <View className="title">热搜榜</View>
          <View className="at-row at-row--wrap hot">
            {_data.map((r, i) => {
              return (
                <View
                  className="at-col at-col-6 list"
                  key={r + i}
                  onClick={this.onChange.bind(this, r)}
                >
                  <View
                    className={classNames(
                      "num",
                      i < 4 && "red",
                      i >= 4 && "secondary"
                    )}
                  >
                    {i + 1}
                  </View>
                  <View>
                    <View className="searchWord">
                      <View>
                        {r.searchWord}
                        {r.iconType !== 0 && (
                          <Text
                            className={classNames(
                              "iconType",
                              r.iconType === 2 && "newIconType",
                              r.iconType === 5 && "promote"
                            )}
                          >
                            {this.getText(r.iconType)}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View className="content">{r.content}</View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}
export default Search;
