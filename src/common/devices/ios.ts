import { AppMethodMapping, CustomWindow } from '@/types/common/devices'
declare let window: CustomWindow
/**
 * @description 每一个app的可调用方法不同, loadAdapterAsync
 * @description default写了默认的app方法，为了兼容性
 */
export class ClientAdapter {
	clientName: string
	methodMap: Partial<AppMethodMapping>
	appBridge: any
	/**
	 * ClientAdapter constructor.
	 *
	 * @param {string} clientName - The name of the client app.
	 * @param {Object} methodMap - The mapping of method names.
	 */
	constructor(clientName: string, methodMap: Partial<AppMethodMapping>) {
		this.clientName = clientName
		this.methodMap = methodMap
		this.appBridge = window.webkit ? window.webkit[clientName || ''] : undefined
		console.log('🚀 ~ ios: app挂载对象 ~ app-:', clientName, this.appBridge)
		console.log('🚀 ~ ios: h5配置app方法映射 ~ ', methodMap)
	}

	public getAppBridge() {
		return this.appBridge
	}

	public hasAppBridge() {
		return this.appBridge && Reflect.ownKeys(this.appBridge).length !== 0
	}

	/**
	 * Retrieve the method based on the name provided.
	 * @description 判断app上有无映射的，默认的方法
	 * @param {string} name - The name of the method to retrieve.
	 * @returns {Function|undefined} - Returns the string if found, else returns undefined.
	 */
	public getMethod(name: keyof AppMethodMapping): keyof AppMethodMapping | string {
		return this.methodMap[name] || name
	}

	/**
	 * @param {string} name - The name of the method to call.
	 * @returns {any} - 返回映射过后的方法名
	 */
	postMessage(name: keyof AppMethodMapping): keyof AppMethodMapping | string {
		const key = this.getMethod(name)
		if (typeof key === 'string') {
			this.appBridge && this.appBridge[key] && this.appBridge[key]?.postMessage('ok')
		} else {
			console.error(`ios方法映射${this.clientName}不存在${key}!`)
		}
		return key
	}

	/**
	 * Call a method without any parameters.
	 * @description app埋点
	 */
	trackEvent(name: string) {
		const key = this.getMethod('track')
		if (typeof key === 'string') {
			console.log('ios: 调用了app埋点', name)
			this.appBridge && this.appBridge[key] && this.appBridge[key]?.postMessage(name)
		}
	}
}
