import type { ReactNode } from 'react';

import { cn } from '../utils/cn';

const ERROR_STATE_CONTENT = {
	notFound: {
		title: (
			<>
				요청하신 페이지를
				<br />
				찾을 수 없습니다.
			</>
		),
		description: (
			<>
				주소가 잘못 입력되었거나,
				<br />
				변경 혹은 삭제되어 페이지를 찾을 수 없어요.
			</>
		),
	},
	network: {
		title: '네트워크에 접속할 수 없습니다.',
		description: '네트워크 연결 상태를 확인해주세요.',
	},
	maintenance: {
		title: '서비스를 점검중입니다.',
		description: '조금만 기다려주세요.',
	},
	sessionPreparing: {
		title: '세션 준비 중',
		description: '조금만 기다려주세요.',
	},
} as const;

export type ErrorStateVariant = keyof typeof ERROR_STATE_CONTENT;

interface ErrorStateProps {
	action?: ReactNode;
	className?: string;
	variant: ErrorStateVariant;
}

const ErrorStateIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="33"
			height="32"
			viewBox="0 0 33 32"
			fill="none"
		>
			<title>error</title>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M32.5 16C32.5 24.8366 25.3366 32 16.5 32C7.66344 32 0.499999 24.8366 0.5 16C0.500001 7.16344 7.66345 -7.72516e-07 16.5 0C25.3366 7.72516e-07 32.5 7.16345 32.5 16ZM15 22C15 21.1716 15.6716 20.5 16.5 20.5C17.3284 20.5 18 21.1716 18 22C18 22.8284 17.3284 23.5 16.5 23.5C15.6716 23.5 15 22.8284 15 22ZM16.5 18.48C15.6716 18.48 15 17.8084 15 16.98L15 9.97998C15 9.15155 15.6716 8.47998 16.5 8.47998C17.3284 8.47998 18 9.15155 18 9.97998V16.98C18 17.8084 17.3284 18.48 16.5 18.48Z"
				fill="#E5E7EB"
			/>
		</svg>
	);
};

export const ErrorState = ({ action, className, variant }: ErrorStateProps) => {
	const content = ERROR_STATE_CONTENT[variant];

	return (
		<div className={cn('relative flex h-dvh w-full flex-col items-center justify-center', className)}>
			<ErrorStateIcon />
			<h1 className="mt-8 mb-4 text-center font-bold text-label-strong text-title1">
				{content.title}
			</h1>
			<p className="text-center font-medium text-body2 text-label-assistive">
				{content.description}
			</p>
			{action}
		</div>
	);
};
