<template>
	<view class="container">
		<block v-for="(strObj, index) in dataArray" :key="index">
			<view v-if="strObj.show" class="line"
				:style="`padding-left: ${strObj.indent}rpx; font-size: ${fontSize}rpx;`">
				<text v-if="collapsable && strObj.hasChild" :data-index="index" @longtap="expandAll" @tap="doExpand"
					:class="[clsgrp[clstype][strObj.expand]]"></text>
				<view style="display: flex; flex-flow: row;">
					<text :class="[kidx === index ? 'active' : '','key']"
						@tap="selectk(index)">{{ strObj.key }}</text>
					<text v-if="strObj.comma">{{ `${strObj.comma}` }}</text>
					<text v-if="strObj.value" :class="[vidx === index ? 'active' : '','val']"
						@tap="selectv(index)">{{ strObj.value }}</text>
					<text v-if="strObj.tail" class="val">{{ strObj.tail }}</text>
					<block v-if="!!strObj.suffix">
						<text class="val" @tap="selectk(index)">{{ '...' }}</text>
						<text class="val">{{ strObj.suffix }}</text>
					</block>
				</view>
			</view>
		</block>
	</view>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue'
	const props = defineProps({
		obj: {
			type: Object,
			default () {
				return {};
			}
		},
		collapsable: {
			type: Boolean,
			default: true
		},
		fontSize: {
			type: Number,
			default: 24
		},
		icon: {
			type: String,
			default: 'plusminus'
		}
	})
	const clstype = ref(['arrow', 'plusminus'].includes(props.icon) ? props.icon : 'plusminus')
	const clsgrp = ref({
		'arrow': {
			true: 'arrow-down',
			false: 'arrow-right'
		},
		'plusminus': {
			true: 'minus',
			false: 'plus'
		}
	})
	const dataArray = ref([])
	const basecode = ref('0123456789abcdefghijklmnopqrstuvwxyz')
	const dataTransform = () => {
		let str = JSON.stringify(props.obj, null, ' ');
		let pl = 0;
		let idn = 0;
		// 提取 JSON 字符串中的键值对，其中键是双引号括起来的字符串，值可以是双引号括起来的字符串或其他类型的值
		let reg = /"(.+)"\s*:\s*("?.+"?),?/;
		let arr = str
			.split(/\n/g)
			.reverse()
			.map(t => {
				let res = {
					text: t
				};
				let regRes = reg.exec(t);
				if (regRes) {
					res.key = regRes[1].trim();
					res.value = regRes[2].replace(/,$/, '');
					res.tail = regRes[2] == res.value ? '' : ',';
					res.comma = ':';
					if ('{' === res.value) {
						res.type = 'Object'
					} else if ('[' === res.value) {
						res.type = 'Array'
					} else {
						try {
							// 如果存在第二层双引号则字符串
							if (/".*?"/.test(res.value)) {
								res['type'] = "String"
							} else {
								res['type'] = "Number"
							}
						} catch (e) {
							console.warn(e)
						}
					}
				} else {
					res.key = t;
					res.value = '';
					res.comma = '';
					if (!['{', '}', '[', ']'].includes(t.trim().replace(/,$/, '').replace(/\"/g, ''))) {
						try {
							// 如果存在第二层双引号则字符串
							if (/".*?"/.test(t)) {
								res['ktype'] = "String"
							} else {
								res['ktype'] = "Number"
							}
						} catch (e) {
							console.warn(e)
						}
					} else {
						if (t.indexOf(']') > -1 || t.indexOf('[') > -1) {
							res['ktype'] = "Array"
						} else {
							res['ktype'] = "Object"
						}
					}
				}
				res.indent = t.search(/[^\s]/) * props.fontSize;
				res.hasChild = res.indent < pl;
				res.expand = true;
				res.show = true;
				res.suffix = '';
				pl = res.indent;
				return res;
			});
		pl = -1;
		let pcode = '';

		dataArray.value = arr.reverse().map(item => {
			const cl = item.indent / props.fontSize;
			if (cl > pl) {
				item.treeCode = pcode + basecode.value.charAt(0);
			} else if (cl == pl) {
				var lastIdx = basecode.value.indexOf(pcode.charAt(pcode.length - 1)) + 1;
				item.treeCode = pcode.substr(0, pcode.length - 1) + basecode.value.charAt(lastIdx);
			} else {
				item.treeCode = pcode.substr(0, pcode.length - 1);
			}
			pl = cl;
			pcode = item.treeCode;
			return item;
		});
	};

	dataTransform();
	const expandAll = (e) => {
		let index = 0;
		if (e) {
			const {
				index: k
			} = e.currentTarget.dataset;
			index = parseInt(k);
		}
		const code = dataArray.value[index].treeCode;
		dataArray.value = dataArray.value.map(item => {
			if (item.treeCode.startsWith(code)) {
				item.suffix = '';
				item.show = true;
				item.expand = true;
			}
			return item;
		});
	};
	const getExpandStatus = (code) => {
		return dataArray.value.find(item => item.treeCode == code).expand;
	}
	const isTail = (idx) => {
		let code = dataArray.value[idx].treeCode;
		let index = dataArray.value.findIndex(item => item.treeCode == code);
		return index < idx;
	}
	const getParentsExpandStatus = (code) => {
		if (code == '0') return true;
		let parents = dataArray.value.filter(item => code.startsWith(item.treeCode) && item.treeCode != code);
		let res = true;
		parents.forEach(item => {
			if (!item.expand) {
				res = false;
			}
		});
		return res;
	}
	const print = () => {
		console.log(props.obj);
		console.log(JSON.stringify(props.obj));
	}
	const doExpand = (e) => {
		let index = 0;
		if (e) {
			const {
				index: k
			} = e.currentTarget.dataset;
			index = parseInt(k);
		}
		let suffixText = '';
		const code = dataArray.value[index].treeCode;
		const expand = !dataArray.value[index].expand; //点击之后的展开状态
		dataArray.value[index].expand = expand; //更新展开状态
		const arr = dataArray.value.map((item, idx) => {
			if (item.treeCode.startsWith(code) && idx != index) {
				//排除本身
				if (!expand) {
					//如果折叠，子项全部隐藏
					item.show = false;
				} else {
					//如果展开，子项的尾巴是否显示看他的父级展开状态
					item.show = getParentsExpandStatus(item.treeCode);
				}
				if (item.treeCode == code) {
					// last one
					suffixText = expand ? '' : `${item.text.trim()}`;
				}
				// 隐藏结尾的 ] } 等
				if (isTail(idx) && !getExpandStatus(item.treeCode)) {
					item.show = false;
				}
			}
			// 处理后缀
			if (item.expand) {
				item.suffix = '';
			}
			return item;
		});
		dataArray.value[index].suffix = suffixText;
		dataArray.value = arr;
	}
  doExpand();
	const vidx = ref(-1)
	const kidx = ref(-1)
	let vt = 0,
		kt = 0
	const selectk = (idx) => {
		vidx.value = idx;
		clearTimeout(vt);
		vt = setTimeout(() => {
			vidx.value = -1;
		}, 600);
		if (props.collapsable)
			doExpand({
				currentTarget: {
					dataset: {
						index: idx
					}
				}
			})
	};
	const selectv = (idx) => {
		kidx.value = idx;
		clearTimeout(kt);
		kt = setTimeout(() => {
			kidx.value = -1;
		}, 600);
	};
	watch(() => props.collapsable, (n, o) => {
		if (!n) {
			expandAll()
		}
	})
	watch(() => props.icon, (n, o) => {
		if (!!n) {
			clstype.value = ['arrow', 'plusminus'].includes(n) ? n : 'plusminus'
		}
	})
	defineExpose({
		print
	})
</script>

<style scoped>
	.container {
		width: auto;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		align-content: center;
		justify-content: flex-start;
		box-sizing: border-box;
	}

	.container .line {
		display: flex;
		position: relative;
		align-items: center;
		justify-content: flex-start;
		width: inherit;
		box-sizing: border-box;
	}

	text {
		margin: 0 4rpx;
	}

	.key,
	.val {
		height: min-content;
		display: inline-block;
		transition-duration: 0.3s;
		border-bottom: solid 4rpx transparent;
	}

	.key.active,
	.val.active {
		transition-duration: 0.3s;
		border-bottom: solid 4rpx rgba(255, 90, 20, 0.8);
	}

	.key {
		color: rgb(48, 49, 51);
	}

	.val {
		color: rgb(48, 49, 51);;
	}

	.String {
		color: #718093;
	}


	.Number {
		color: #686de0;
	}

	.Array {
		color: #8c7ae6;
	}

	.Object {
		color: #4cd137;
	}

	.expand {
		display: inline-flex;
		width: 32rpx;
		height: 32rpx;
		padding: 0;
		align-items: center;
		transform: scale(0.8);
		justify-items: center;
		justify-content: center;
		border: solid 1rpx lightgray;
		box-sizing: border-box;
		color: gray;
		font-size: 24rpx;
	}

	.arrow-right,
	.arrow-down {
		display: inline-block;
		width: 24rpx;
		height: 24rpx;
		background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23fff' d='M-1-1h8.575v8.575H-1z'/%3E%3Cg%3E%3Cpath stroke='%2300f' d='M11.482 11.865L2.132.896l16.812 10.969L2.132 22.833l9.35-10.968z' fill-opacity='null' stroke-opacity='null' stroke-width='null' fill='%2300f'/%3E%3C/g%3E%3C/svg%3E");
		background-size: cover;
	}

	.arrow-down {
		transform: rotate(90deg);
		-ms-transform: rotate(90deg);
		-moz-transform: rotate(90deg);
		-webkit-transform: rotate(90deg);
		-o-transform: rotate(90deg);
	}

	.plus {
    width:0;
    height:0;
    border-width:10rpx;
    border-style:solid;
    border-color:transparent transparent transparent #000;
	}

	.minus {
    width:0;
    height:0;
    border-width:10rpx 10rpx 0;
    border-style:solid;
    border-color:#000 transparent transparent;
	}
</style>