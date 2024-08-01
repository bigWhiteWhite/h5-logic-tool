import { AppMethodMapping, CustomWindow } from '@/types/common/devices'
import { copy } from '@/utils'
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
		this.appBridge = window[clientName || ''] || undefined
		console.log('🚀 ~ android: app挂载对象 ~ app-:', clientName, this.appBridge)
		console.log('🚀 ~ android: h5配置app方法映射 ~ ', methodMap)
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
	 * @description 无参数app方法调用
	 * @param {string} name - The name of the method to call.
	 */
	postMessage(name: keyof AppMethodMapping) {
		const key = this.getMethod(name)
		if (typeof key === 'string') {
			return this.appBridge[key]()
		} else {
			console.error(`android方法映射${this.clientName}不存在${key}!`)
		}
	}

	/**
	 * Call a method without any parameters.
	 * @description 需要进行json切换的方法
	 * @param {string} name - The name of the method to call.
	 * @returns {any} - Returns the result of the method call if it's a string.
	 */
	jsonMethod(name: keyof AppMethodMapping) {
		const key = this.getMethod(name)
		if (typeof key === 'string') {
			const data = this.appBridge[key]()
			console.log(`🚀 ~ android ~ jsonMethod ~ ${key}:`, data)
			const result = data ? JSON.parse(data) : {}
			return result
		} else {
			console.error(`android方法映射${this.clientName}不存在${key}!`)
		}
	}

	/**
	 * Call a method without any parameters.
	 * @description 还款方式页获取PID,需要兼容common-h5的方式去获PID
	 */
	getPaymentId() {
		const newMethod = this.getMethod('paymentId')
		const oldMethod = this.getMethod('getPaymentInfo')
		if (typeof newMethod === 'string') {
			return this.appBridge[newMethod]()
		} else if (typeof oldMethod === 'string') {
			const payInfo = this.appBridge[oldMethod]()
			const paymentInfo = payInfo ? JSON.parse(payInfo) : {}
			console.warn(`🚀 ~ 旧版本调用${oldMethod}:`, paymentInfo.paymentId)
			return paymentInfo?.paymentId
		}
	}

	/**
	 * Call a method without any parameters.
	 * @description 关闭当前webview,需要兼容common-h5的方式去关闭当前webview
	 */
	closeWebView() {
		const newMethod = this.getMethod('closeWeb')
		const oldMethod = this.getMethod('closeWebActivity')
		if (typeof newMethod === 'string') {
			return this.appBridge[newMethod]()
		} else if (typeof oldMethod === 'string') {
			return this.appBridge[oldMethod]()
		}
	}

	/**
	 * Call a method without any parameters.
	 * @description 还款方式页获取支付金额，需要转换为Number
	 */
	getRepayAmount() {
		const key = this.getMethod('repayAmount')
		if (typeof key === 'string') return Number(this.appBridge[key]())
		else return 0
	}

	/**
	 * Call a method without any parameters.
	 * @description 返回首页并立刻请求授信, 传true让app不要跳回授信拒绝，避免死循环
	 */
	applyCredit(flag: boolean) {
		const key = this.getMethod('applyCredit')
		if (typeof key === 'string') return this.appBridge[key](flag)
	}

	/**
	 * Call a method without any parameters.
	 * @description appDownPdf 传输pdf给app下载
	 */
	appDownPdf(file: any) {
		const key = this.getMethod('downloadPdf')
		if (typeof key === 'string') return this.appBridge[key](file)
	}

	/**
	 * Call a method without any parameters.
	 * @description 获取app当前翻译
	 */
	getLanguage() {
		const key = this.getMethod('language')
		if (typeof key === 'string') {
			console.log('android: 获取了app语言')
			return this.appBridge[key]().toLowerCase()
		}
	}

	/**
	 * Call a method without any parameters.
	 * @description 选择app图片的方法
	 */
	selectPicture(index: number, name: string) {
		const key = this.getMethod('selectImg')
		if (typeof key === 'string') return this.appBridge[key](index, name)
	}

	/**
	 * Call a method without any parameters.
	 * @description app埋点
	 */
	trackEvent(name: string, params?: any) {
		const key = this.getMethod('track')
		if (typeof key === 'string') {
			console.log('调用了app埋点', name, params)
			const eventParams = JSON.stringify(params)
			return this.appBridge[key](name, eventParams)
		}
	}

	/**
	 * Call a method without any parameters.
	 * @description 点击邀请按钮，调用app
	 */
	inviteFriendsShare(inviteCode: string, inviteText: string) {
		const key = this.getMethod('clickShare')
		if (typeof key === 'string') return this.appBridge[key](inviteCode, inviteText)
	}

	/**
	 * Call a method without any parameters.
	 * @description 复制文案到剪切板
	 */
	copyContent(content: string) {
		try {
			if (!content) {
				throw new Error('copy content is null')
			}
			const key = this.getMethod('copyText')
			if (typeof key === 'string') {
				console.log('app复制')
				this.appBridge[key](content)
			} else {
				console.log('h5复制')
				copy(content)
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * Call a method without any parameters.
	 * @description 给app传递白屏的时间
	 */
	recordOpenTime(load_time: string) {
		const key = this.getMethod('pageOpened')
		if (typeof key === 'string') return this.appBridge[key](load_time)
	}

	/**
	 * Call a method without any parameters.
	 * @description 给app传递白屏的时间
	 */
	openPhoneCallPage(yoUssdCode: string) {
		const key = this.getMethod('callPage')
		if (typeof key === 'string') return this.appBridge[key](yoUssdCode)
	}

	/**
	 * Call a method without any parameters.
	 * @description app推送信息，用户进入活动界面有可能没有登陆，判断有无authorization，无则调用app方法跳去登陆界面
	 */
	gotoLoginAndBackToWeb(link: string) {
		const key = this.getMethod('loginRedirect')
		if (typeof key === 'string') return this.appBridge[key](link)
	}

	/**
	 * Call a method without any parameters.
	 * @description app推送信息，用户进入活动界面有可能没有登陆，判断有无authorization，无则调用app方法跳去登陆界面
	 */
	sendCouponReceived(couponType: number) {
		const key = this.getMethod('couponReceived')
		if (typeof key === 'string') return this.appBridge[key](couponType)
	}

	/**
	 * Call a method without any parameters.
	 * @description 返回上一步
	 */
	backToLastPage() {
		const key = this.getMethod('lastPage')
		if (typeof key === 'string') {
			console.log('调用了app的返回方法 --- backToLastPage')
			this.appBridge[key]()
			return 'pageSuccess'
		}
	}

	/**
	 * Call a method without any parameters.
	 * @description appId打开谷歌商店
	 */
	openGooglePlay(appid: string, url: string) {
		const key = this.getMethod('googlePlay')
		if (typeof key === 'string') {
			return this.appBridge[key](appid)
		} else {
			window.location.replace(url)
		}
	}
}
