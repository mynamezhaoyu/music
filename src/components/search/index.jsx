import Taro, { Component } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components';
import { AtSearchBar } from 'taro-ui';
import './index.scss';
import IconFont from '../iconfont';
import { common, http, addRedux, connect } from '../../common/js/export';
import classNames from 'classnames';
@connect(({ counter }) => ({
	counter
}))
class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			isDetail: true,
			isSuggest: false,
			hotData: [],
			suggestData: [],
			taroInfo: {}
		};
	}
	componentDidMount() {
		// 整个页面只需要执行一次的时候用这个
		Taro.getSystemInfo({}).then((res) => {
			this.setState({
				taroInfo: res
			});
		});
	}
	componentDidShow() {}
	timeCount = null;
	onChange(v) {
		this.setState({
			search: v,
			isSuggest: v ? true : false,
			suggestData: []
		});
		if (!v.trim()) return;
		if (this.timeCount) return;
		this.timeCount = 1;
		let _this = this;
		setTimeout(() => {
			_this.httpSuggest(v);
		}, 300);
	}
	async httpSuggest(v) {
		let data = await http.get('search/suggest', {
			keywords: v,
			type: 'mobile'
		});
		this.timeCount = null;
		this.setState({
			suggestData: data.data.result ? data.data.result.allMatch || [] : []
		});
	}
	async focus() {
		this.setState({
			isDetail: true
		});
		if (!this.state.hotData.length) {
			let arr = await http.get('search/hot/detail');
			this.setState({
				hotData: arr.data.data
			});
		}
		let query;
		if (process.env.TARO_ENV === 'h5') {
			query = Taro.createSelectorQuery();
		} else {
			query = Taro.createSelectorQuery().in(this.$scope);
		}

		query
			.select('.acc')
			.boundingClientRect((rec) => {
				console.log(rec);
			})
			.exec();
	}
	getText(val) {
		let arr = [ { type: 1, text: 'HOT' }, { type: 2, text: 'NEW' }, { type: 5, text: '↑' } ];
		let data = arr.filter((r) => r.type === val);
		return data.length ? data[0].text : '';
	}
	async searchVal(val) {
		let data = await http.get('search', {
			keywords: val.searchWord,
			type: 1018
		});
		if (this.state.isSuggest) return;
		this.setState({
			isSuggest: true
		});
	}
	onActionClick() {
		this.setState({
			isDetail: false,
			isSuggest: false,
			search: ''
		});
	}
	render() {
		const { isDetail, isSuggest, hotData, search, suggestData, taroInfo } = this.state;
		return (
			<View className="_search acc">
				<AtSearchBar onChange={this.onChange.bind(this)} onFocus={this.focus.bind(this)} onActionClick={this.onActionClick.bind(this)} value={this.state.search} actionName="取消" className="header-search" />
				<View className={classNames('top-view', isDetail && 'top-view-show')} style={{ height: [ `${taroInfo.height || 0}px` ], left: [ `${taroInfo.screenWidth || 0}px` ] }}>
					<View className={classNames('', isSuggest && 'none')}>
						<View className="title">
							<View>搜索历史</View>
							<IconFont name="huishou" size="60" />
						</View>
						<View />
						<View className="title">热搜榜</View>
						<View className="at-row at-row--wrap hot">
							{hotData.map((r, i) => {
								return (
									<View className="at-col at-col-6 list" key={r + i} onClick={this.searchVal.bind(this, r)}>
										<View className={classNames('num', i < 4 && 'red', i >= 4 && 'secondary')}>{i + 1}</View>
										<View>
											<View className="searchWord">
												<View>
													{r.searchWord}
													{r.iconType !== 0 && <Text className={classNames('iconType', r.iconType === 2 && 'newIconType', r.iconType === 5 && 'promote')}>{this.getText(r.iconType)}</Text>}
												</View>
											</View>
											<View className="content">{r.content}</View>
										</View>
									</View>
								);
							})}
						</View>
					</View>
					<View className={classNames('search', !isSuggest && 'none')}>
						<View className="search-title">搜索 “{search}”</View>
						{suggestData.map((r) => {
							return (
								<View key={r.keyword} className="list">
									<IconFont name="SanMiAppglyphico6" color={[ '#efefef', 'orange' ]} size="60" />
									<View className="text">{r.keyword}</View>
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
