import { DeviceInit } from '../../../src/common/devices/index'
interface CustomWindow extends Window {
	clientH5: any
	testDevices: any
	appCountry: any
	reqHeaders: any
	getRepayParams: any
	language: any
}
declare let window: CustomWindow

beforeAll(() => {
	jest.useFakeTimers() // 使用 Jest 模拟定时器
	window.testDevices = {
		appCountry: () => {
			return 'kenya'
		},
		reqHeaders: () => {
			return JSON.stringify({
				appId: 'id',
				authorization: 'Bearer string',
				ProxyChannel: 'H5'
			})
		},
		language: () => {
			return 'es'
		},
		paymentId: () => {
			return 'paymentId'
		},
		repayAmount: () => {
			return '12800'
		},
		postMessage: (key: string) => {
			if (key === 'appCountry') {
				setTimeout(() => {
					window.appCountry('kenya')
				}, 1000)
			}
			if (key === 'reqHeaders') {
				setTimeout(() => {
					window.reqHeaders(
						JSON.stringify({
							appId: 'id',
							authorization: 'Bearer string',
							ProxyChannel: 'H5'
						})
					)
				}, 1000)
			}
			if (key === 'language') {
				setTimeout(() => {
					window.language('es')
				}, 1000)
			}
			if (key === 'getRepayParams') {
				setTimeout(() => {
					window.getRepayParams(
						JSON.stringify({
							fetchCouponId: '',
							payAmount: 390,
							isExtendRepay: false,
							paymentId: 'P09744daed52b6000',
							extendDays: '10',
							overDueDays: 12,
							dueDate: '2022-08-16'
						})
					)
				}, 1000)
			}
		}
	}
})
describe('Init Devices', () => {
	it('init Devices', async () => {
		const app = new DeviceInit(0, 'testDevices', {})
		app
			.initApp(['appCountry', 'reqHeaders', 'language', 'getRepayParams'])
			.then((results) => {
				console.log('All methods have been called', results)
			})
			.catch((error) => {
				console.error('An error occurred', error)
			})
		console.log('🚀 ~ it ~ window.clientH5:', window.clientH5)
		jest.runAllTimers() // 快速推进所有定时器
	})
})
