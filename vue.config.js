   module.exports = {
	    lintOnSave:false,
	    devServer:{
	    	// 关闭eslint语法验证
	    	overlay:{
	    		warning:false,
	    		errors:false
	    	},
			proxy: {
				'/api': {
					target: 'http://localhost:8810',
					changeOrigin: true,
					secure: false
				},
				'/images': {
					target: 'http://localhost:8810',
					changeOrigin: true,
					secure: false
				},
				'/static': {
					target: 'http://localhost:8810',
					changeOrigin: true,
					secure: false
				},
				'/upload': {
					target: 'http://localhost:8810',
					changeOrigin: true,
					secure: false
				}
			}
	    },
        publicPath: process.env.NODE_ENV === 'production' ? './' : './'  
   };  