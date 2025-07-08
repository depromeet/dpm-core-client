import localFont from 'next/font/local';

export const pretendard = localFont({
	display: 'swap',
	adjustFontFallback: 'Arial',
	variable: '--font-pretendard',
	src: [
		{
			path: '../assets/fonts/pretendard/Pretendard-Thin.woff',
			weight: '100',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-ExtraLight.woff',
			weight: '200',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-Light.woff',
			weight: '300',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-Regular.woff',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-Medium.woff',
			weight: '500',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-SemiBold.woff',
			weight: '600',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-Bold.woff',
			weight: '700',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-ExtraBold.woff',
			weight: '800',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-Black.woff',
			weight: '900',
			style: 'normal',
		},
	],
});
