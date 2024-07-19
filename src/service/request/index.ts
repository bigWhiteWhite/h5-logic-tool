/* eslint-disable no-mixed-spaces-and-tabs */
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { RequestHook, RequestConfig } from '@/types/axios'

class Request {
	instance: AxiosInstance // axios实例
	interceptors?: RequestHook // 拦截器

	constructor(config: RequestConfig) {
		this.instance = axios.create(config)
		this.interceptors = config.interceptors
		// 实例特有的拦截器
		this.instance?.interceptors.request.use(this.interceptors?.requestInterceptor, this.interceptors?.requestInterceptorsCatch)

		this.instance?.interceptors.response.use(this.interceptors?.responseInterceptor, this.interceptors?.responseInterceptorsCatch)

		// 全局通用的拦截器,每一个实例都有
		this.instance?.interceptors.request.use(
			(config) => {
				return {
					...config,
					baseURL: '/guidance',
					headers: {
						ProxyChannel: 'H5',
						App_id: 'com.si.ci.xx.qq',
						'Accept-Language': 'en',
						'Content-Type': 'application/json',
						'X-Requested-With': null
						// App_version: userParams.value.appVersion || userParams.value.App_version || '',
						// App_id: userParams.value.appId || userParams.value.App_id || id || '',
						// Authorization: authorization || Authorization || ''
					}
				}
			},
			(err) => {
				return err
			}
		)
		this.instance?.interceptors.response.use(
			(res) => {
				return res
			},
			(err) => {
				return Promise.reject(err)
			}
		)
	}

	request<T = any>(config: RequestConfig<T>): Promise<T> {
		return new Promise((resolve, reject) => {
			// 单个请求对请求config的处理
			if (config.interceptors?.requestInterceptor) {
				config = config.interceptors.requestInterceptor(config)
			}

			this.instance
				.request<any, T>(config)
				.then((res) => {
					if (config.interceptors?.responseInterceptor) {
						res = config.interceptors.responseInterceptor(res)
					}
					resolve(res)
				})
				.catch((err) => {
					reject(err)
					return err
				})
		})
	}

	get<T = any>(config: RequestConfig<T>): Promise<T> {
		return this.request<T>({ ...config, method: 'GET' })
	}
	post<T = any>(config: RequestConfig<T>): Promise<T> {
		return this.request<T>({ ...config, method: 'POST' })
	}
	delete<T = any>(config: RequestConfig<T>): Promise<T> {
		return this.request<T>({ ...config, method: 'DELETE' })
	}
	patch<T = any>(config: RequestConfig<T>): Promise<T> {
		return this.request<T>({ ...config, method: 'PATCH' })
	}
}

export default Request
