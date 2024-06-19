import { toRaw } from 'vue'

//拼接歌手名称
function SpliceName(data) {
	//还原成普通对象
	const Raw = toRaw(data)
	let name = ''
	//拼接歌曲歌手名字
	for (let key in Raw) {
		name += Raw[key].name + '/'
	}
	//去除最后一位
	return name.slice(0, -1)
}

export { SpliceName }
