   module.exports = {
	    lintOnSave:false,
	    devServer:{
	    	// 关闭eslint语法验证
	    	overlay:{
	    		warning:false,
	    		errors:false
	    	},
			proxy:{
				'/api':{
					target: 'http://localhost:8810',
					changeOrigin: true,
					// rewrite: (p) => p.replace(/^\/api/, 'api')
				},
				'/images':{
					target: 'http://localhost:8810',
					changeOrigin: true,
				},
				'/static':{
					target: 'http://localhost:8810',
					changeOrigin: true,
				},
				'/upload':{
					target: 'http://localhost:8810',
					changeOrigin: true,
				}
			}
	    },
        publicPath: process.env.NODE_ENV === 'production' ? './' : './'  
   };
