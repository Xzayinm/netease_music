import { get, post } from '../utils/request'

// const NeteaseCloudMusicApiServer = 'https://music.huankong.top'
const NeteaseCloudMusicApiServer = '/api'

const api = {
  //获取热门歌单等
  getMusicTopList(params) {
    return get(`${NeteaseCloudMusicApiServer}/toplist`, params)
  },
  //获取歌单详细数据
  getMusicList(params) {
    return post(`${NeteaseCloudMusicApiServer}/playlist/track/all`, params)
  },
  //手机密码登陆
  loginByPhone(params) {
    return post(`${NeteaseCloudMusicApiServer}/login/cellphone`, params)
  },
  //手机验证码发送
  loginByPhoneBycode_send(params) {
    return post(`${NeteaseCloudMusicApiServer}/captcha/sent`, params)
  },
  //手机验证码校验
  loginByPhoneBycode_check(params) {
    return post(`${NeteaseCloudMusicApiServer}/captcha/verify`, params)
  },
  //邮箱密码登陆
  loginByEmail(params) {
    return post(`${NeteaseCloudMusicApiServer}/login`, params)
  },
  //二维码登陆生成key
  loginByQRcodeGetKey(params) {
    return post(`${NeteaseCloudMusicApiServer}/login/qr/key`, params)
  },
  //二维码登陆生成二维码
  loginByQRcodeGetQRcode(params) {
    return post(`${NeteaseCloudMusicApiServer}/login/qr/create`, params)
  },
  //二维码扫码状态
  loginByQRcodeCheckStatus(params) {
    return post(`${NeteaseCloudMusicApiServer}/login/qr/check`, params)
  },
  //获取登陆状态
  loginStatus(params) {
    return post(`${NeteaseCloudMusicApiServer}/login/status`, params)
  },
  //刷新状态
  loginStatusRefresh(params) {
    return post(`${NeteaseCloudMusicApiServer}/login/refresh`, params)
  },
  //退出登陆
  logout(params) {
    return post(`${NeteaseCloudMusicApiServer}/logout`, params)
  },
  //获取推荐歌单
  personalized(params) {
    return post(`${NeteaseCloudMusicApiServer}/personalized`, params)
  },
  //获取推荐歌单
  personalizedNewsong(params) {
    return post(`${NeteaseCloudMusicApiServer}/personalized/newsong`, params)
  },
  //获取歌曲播放链接
  getSongUrl(params) {
    return post(`${NeteaseCloudMusicApiServer}/song/url`, params)
  },
  //获取歌曲信息
  getSongDetails(params) {
    return post(`${NeteaseCloudMusicApiServer}/song/detail`, params)
  },
  //获取歌词
  lyric(params) {
    return post(`${NeteaseCloudMusicApiServer}/lyric`, params)
  },
  //搜索
  search(params) {
    return post(`${NeteaseCloudMusicApiServer}/search`, params)
  },
  //喜欢
  like(params) {
    return post(`${NeteaseCloudMusicApiServer}/like`, params)
  },
  //喜欢列表
  likelist(params) {
    return post(`${NeteaseCloudMusicApiServer}/likelist`, params)
  }
}

export default api
