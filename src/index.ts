// import { getWebPageContent } from './service/apis'

// 动态导入 import('@utils/test').then(({ hhh }) => hhh('foo'))
export const testLog = async () => {
	try {
		// const message = await getWebPageContent({
		// 	pageType: 'privacyPolicy'
		// })
		// console.log(message)
		return 'log'
	} catch (error) {
		return Promise.reject(error)
	}
}
