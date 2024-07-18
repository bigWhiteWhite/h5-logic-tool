import Request from './request'
import { RequestConfig } from '@/types/axios'

// 可以创建多个axios实例,拥有不同的拦截器
const $https = new Request({
	timeout: 100000,
	interceptors: {
		requestInterceptor: (config: RequestConfig) => {
			console.log('🚀 ~ config:', config)
			return config
		},
		requestInterceptorsCatch: (err) => {
			return Promise.reject(err)
		},
		responseInterceptor: (res) => {
			const { data, config } = res
			const { responseType } = config
			if (res.status === 200) {
				if (responseType === 'arraybuffer') {
					return data
				}
				if (data && data.code === '0000') {
					return data.data
					//如果状态码不是0000， 就抛出异常
				} else {
					return Promise.reject(data)
				}
			} else {
				return Promise.reject(new Error('status not 200!'))
			}
		},
		responseInterceptorsCatch: (err) => {
			return Promise.reject(err)
		}
	}
})

export { $https }
