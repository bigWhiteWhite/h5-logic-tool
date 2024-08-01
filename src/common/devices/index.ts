import { AppMethodMapping, CustomWindow } from '@/types/common/devices'
import { ClientAdapter as AndroidClientAdapter } from './android'
import { ClientAdapter as FlutterAdapter } from './flutter'
import { ClientAdapter as IosAdapter } from './ios'
declare let window: CustomWindow

export class DeviceInit {
	deviceType: 0 | 1 | 2
	clientH5?: AndroidClientAdapter | FlutterAdapter | IosAdapter

	/**
	 * ClientAdapter constructor.
	 *
	 * @param {number} deviceType - 0 - android, 1 - flutter, 2 - ios
	 * @param {string} clientName - The name of the client app.
	 * @param {Object} methodMap - The mapping of method names.
	 */
	constructor(deviceType: 0 | 1 | 2, clientName: string, methodMap: Partial<AppMethodMapping> = {}) {
		this.deviceType = deviceType
		if (deviceType === 0) {
			this.clientH5 = new AndroidClientAdapter(clientName, methodMap)
		} else if (deviceType === 1) {
			this.clientH5 = new FlutterAdapter(clientName, methodMap)
		} else if (deviceType === 2) {
			this.clientH5 = new IosAdapter(clientName, methodMap)
		}
		if (this.clientH5) {
			window.clientH5 = this.clientH5
		}
	}

	// 初始化入口
	initApp(initList: Array<keyof AppMethodMapping>) {
		if (initList && initList.length > 0) {
			const promises = initList.map((name: keyof AppMethodMapping) => {
				if (typeof (this as any)[name] === 'function') {
					return (this as any)[name]()
				} else {
					console.warn(`Method ${name} does not exist on MyClass`)
					return Promise.resolve() // 确保所有返回的都是 Promise
				}
			})
			return Promise.all(promises)
		} else {
			return Promise.reject(new Error('initList can no be empty Array!'))
		}
	}

	// 初始化获取请求头
	reqHeaders() {
		return new Promise((resolve) => {
			if (this.deviceType === 0) {
				const header = window.clientH5.jsonMethod('reqHeaders')
				resolve({ header })
			} else {
				const name: string = window.clientH5.postMessage('reqHeaders')
				if (name) {
					window[name] = (header: string) => {
						resolve({ header: header ? JSON.parse(header) : null })
					}
				}
			}
		})
	}
	// 初始化获取国家
	appCountry() {
		return new Promise((resolve) => {
			if (this.deviceType === 0) {
				const nation: string = window.clientH5.postMessage('appCountry')
				if (nation) {
					resolve({ nation: nation.toLowerCase() })
				}
			} else {
				const name: string = window.clientH5.postMessage('appCountry')
				if (name) {
					window[name] = (nation: string) => {
						resolve({ nation: nation?.toLowerCase() })
					}
				}
			}
		})
	}
	// 初始化获取语言
	language() {
		return new Promise((resolve) => {
			if (this.deviceType === 0) {
				const lang: string = window.clientH5.postMessage('language')
				if (lang) {
					resolve({ lang: lang.toLowerCase() })
				}
			} else {
				const name: string = window.clientH5.postMessage('language')
				if (name) {
					window[name] = (lang: string) => {
						resolve({ lang: lang?.toLowerCase() })
					}
				}
			}
		})
	}
}
