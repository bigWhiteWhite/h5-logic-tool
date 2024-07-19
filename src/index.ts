import { getWebPageContent } from './service/apis'
// 动态导入 import('@utils/test').then(({ hhh }) => hhh('foo'))
export const getWebContent = async () => {
	try {
		const message = await getWebPageContent({
			pageType: 'privacyPolicy'
		})
		console.log(message)
		return message
	} catch (error) {
		return Promise.reject(error)
	}
}
