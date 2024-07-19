// import axios from 'axios'
import { getWebContent } from '../src/index'
import { $https } from '../src/service'
jest.mock('axios')
// const mockedAxios = axios as jest.Mocked<typeof axios> // 普通的axios使用
beforeAll(() => {})
describe('fetch', () => {
	it('fetch content success', async () => {
		const data = {
			code: '0000',
			msg: 'Action completed successfully',
			data: '<p>test</p>'
		}
		$https.post = jest.fn().mockResolvedValue({ data })
		// mockedAxios.post.mockResolvedValue(data)
		const result = await getWebContent()
		expect(result)
	})

	it('fetch content error', async () => {
		expect.assertions(1)
		const data = new Error('error')
		$https.post = jest.fn().mockRejectedValue(data)
		await expect(getWebContent()).rejects.toThrow('error')
	})
})
