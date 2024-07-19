// import { getWebPageContent } from './service/apis'
import { hhh } from '@utils/aaa'
// 动态导入 import('@utils/test').then(({ hhh }) => hhh('foo'))
export const testLog = async () => {
	try {
		// const message = await getWebPageContent({
		// 	pageType: 'privacyPolicy'
		// })
		// console.log(message)
		hhh('123')
		return 'log'
	} catch (error) {
		return Promise.reject(error)
	}
}
export { hhh }
