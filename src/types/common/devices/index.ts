export interface CustomWindow extends Window {
	webkit?: {
		[key: string]: any
	}
	[key: string]: any
}
export interface NationConfig {
	affSuffix: Array<string>
	subSuffix: string
	nation: string
	nationName: string
	sensorsSign: string
	localUrl: string
	lang: string
	sign: string
	areaCode: string
	regexp: any
	phonePlaceholder: string
	phoneLength: string
	baseUrl: string
}
export interface AppConfig {
	defaultLanguage: string
	defaultNation: string
	name: string
	clientName: string
	hashName: string
	appName: string
	noEncry: boolean
	domain: string
	headers: {
		test_app_id: string
		App_id: string
	}
	nationConfig: {
		[key: string]: NationConfig
	}
	testPublicKey: string
	prePublicKey: string
	prodPublicKey: string
}
export interface AppMethodMapping {
	reqHeaders: string
	appCountry: string
	paymentId: string
	contractPid: string
	isExtend: string
	repayAmount: string
	extendDays: string
	jumpHomeClick: string
	pageFrom: string
	jumpHome: string
	equityCouponInfo: string
	applyCredit: string
	closeWeb: string
	selectImg: string
	language: string
	openMono: string
	downloadPdf: string
	track: string
	couponList: string
	clickShare: string
	copyText: string
	pageOpened: string
	reachBottom: string
	callPage: string
	lastPage: string
	bindCard: string
	googlePlay: string
	loginRedirect: string
	[key: string]: string
}
