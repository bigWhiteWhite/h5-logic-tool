import { $https } from '@/service/index'

export const getWebPageContent = (data?: any) => {
	return $https.post({
		url: '/yttcxysecurityxqwhjn/ziocwtgetWebPageContent',
		data
	})
}
