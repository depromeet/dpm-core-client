import localFont from 'next/font/local';

// TODO: 폰트 적용이 이상한지 체크하기
export const pretendard = localFont({
	display: 'swap',
	adjustFontFallback: 'Arial',
	variable: '--font-pretendard',
	src: [
		{
			path: '../assets/fonts/pretendard/Pretendard-Thin.subset.woff2',
			weight: '100',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-ExtraLight.subset.woff2',
			weight: '200',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-Light.subset.woff2',
			weight: '300',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-Regular.subset.woff2',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-Medium.subset.woff2',
			weight: '500',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-SemiBold.subset.woff2',
			weight: '600',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-Bold.subset.woff2',
			weight: '700',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-ExtraBold.subset.woff2',
			weight: '800',
			style: 'normal',
		},
		{
			path: '../assets/fonts/pretendard/Pretendard-Black.subset.woff2',
			weight: '900',
			style: 'normal',
		},
	],
});

// export const pretendard = localFont({
// 	display: 'swap',
// 	variable: '--font-pretendard',
// 	weight: '100 900',
// 	src: '../assets/fonts/pretendard/PretendardVariable.woff2',
// });
