module.exports = {
	devServer: {
		proxy: {
			'/api': {
				// target: 'https://music.huankong.top',
				target: 'http://127.0.0.1:3000',
				changeOrigin: true,
				ws: false,
				pathRewrite: {
					'^/api': '',
				},
			},
		},
	},
}
