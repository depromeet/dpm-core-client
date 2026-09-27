import Link from 'next/link';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { HTTPError, TimeoutError } from 'ky';
import { Button, CircleAlert } from '@dpm-core/shared';

const NETWORK_ERROR_REGEX = /failed to fetch|networkerror|load failed/i;

const checkNetworkError = (error: Error) => {
	return (
		error instanceof TimeoutError ||
		(error instanceof TypeError && NETWORK_ERROR_REGEX.test(error.message))
	);
};

export function SessionDetailErrorFallback({ error, reset }: ErrorBoundaryFallbackProps) {
	const { reset: resetQueries } = useQueryErrorResetBoundary();

	const handleReset = () => {
		reset();
		resetQueries();
	};

	const isNotFound = error instanceof HTTPError && error.response.status === 404;
	const isNetworkError = checkNetworkError(error);

	const title = isNotFound
		? '존재하지 않는 세션이에요.'
		: isNetworkError
			? '네트워크에 연결할 수 없어요.'
			: error instanceof HTTPError
				? '세션 정보를 불러오지 못했어요.'
				: '문제가 발생했어요.';

	const description = isNotFound
		? '세션이 추가되지 않았거나 존재하지 않아요.\n운영진에게 문의해주세요.'
		: isNetworkError
			? '인터넷 연결을 확인하고 다시 시도해주세요.'
			: '잠시 후 다시 시도해주세요.';

	return (
		<section className="relative flex w-full flex-1 flex-col items-center justify-center px-4 pb-24 text-center">
			<CircleAlert size={40} color="#E5E7EB" aria-hidden="true" />
			<h1 className="mt-8 mb-4 text-center font-bold text-label-strong text-title1">{title}</h1>
			<p className="whitespace-pre-line text-center font-medium text-body2 text-label-assistive">
				{description}
			</p>
			<div className="fixed right-0 bottom-0 left-0 z-10 mx-auto max-w-lg bg-background-normal px-5 pt-3 pb-5">
				{isNotFound ? (
					<Button variant="secondary" size="lg" className="w-full" asChild>
						<Link href="/">홈으로 돌아가기</Link>
					</Button>
				) : (
					<Button variant="secondary" size="lg" className="w-full" onClick={handleReset}>
						다시 시도하기
					</Button>
				)}
			</div>
		</section>
	);
}
