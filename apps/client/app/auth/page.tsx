import { Button } from '@dpm-core/shared';
import Link from 'next/link';

const AuthPage = () => {
	return (
		<div className="relative w-full h-dvh flex flex-col items-center justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="33"
				height="32"
				viewBox="0 0 33 32"
				fill="none"
			>
				<title>error</title>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M32.5 16C32.5 24.8366 25.3366 32 16.5 32C7.66344 32 0.499999 24.8366 0.5 16C0.500001 7.16344 7.66345 -7.72516e-07 16.5 0C25.3366 7.72516e-07 32.5 7.16345 32.5 16ZM15 22C15 21.1716 15.6716 20.5 16.5 20.5C17.3284 20.5 18 21.1716 18 22C18 22.8284 17.3284 23.5 16.5 23.5C15.6716 23.5 15 22.8284 15 22ZM16.5 18.48C15.6716 18.48 15 17.8084 15 16.98L15 9.97998C15 9.15155 15.6716 8.47998 16.5 8.47998C17.3284 8.47998 18 9.15155 18 9.97998V16.98C18 17.8084 17.3284 18.48 16.5 18.48Z"
					fill="#FFC06E"
				/>
			</svg>
			<h1 className="mt-8 mb-4 text-title1 font-bold text-label-strong text-center">
				가입 요청 완료
			</h1>
			<p className="text-body2 font-medium text-label-assistive text-center">
				운영진 확인 후 가입이 승인됩니다.
			</p>
			<Button className="fixed max-w-lg bottom-0" variant="secondary" size="full" asChild>
				<Link href="/login">로그인 화면으로</Link>
			</Button>
		</div>
	);
};

export default AuthPage;
