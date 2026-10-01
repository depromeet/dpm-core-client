'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@dpm-core/shared';

import { SafeAreaAppLayout } from '@/components/app-layout';

interface FeedbackFormProps {
	sessionId: number;
	sessionTitle: string;
}

const SATISFACTION_OPTIONS = [
	{ value: 5, label: '매우 만족했어요.' },
	{ value: 4, label: '만족했어요.' },
	{ value: 3, label: '보통이었어요.' },
	{ value: 2, label: '별로였어요.' },
	{ value: 1, label: '매우 별로였어요.' },
] as const;

export const FeedbackForm = ({ sessionId: _sessionId, sessionTitle }: FeedbackFormProps) => {
	const router = useRouter();
	const [satisfaction, setSatisfaction] = useState<number | null>(null);
	const [submitted, setSubmitted] = useState(false);

	const submitFeedback = () => {
		if (satisfaction === null) return;

		// TODO: API 명세 확정 후 제출 mutation을 연결합니다.
		setSubmitted(true);
	};

	if (submitted) {
		return (
			<SafeAreaAppLayout className="h-dvh bg-background-normal">
				<div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
					<div className="mb-5 flex size-12 items-center justify-center rounded-full bg-primary-subtle">
						<Check className="size-6 text-primary-normal" aria-hidden="true" />
					</div>
					<h1 className="font-bold text-headline2 text-label-normal">피드백을 제출했어요.</h1>
					<p className="mt-2 text-body2 text-label-assistive">
						소중한 의견 감사해요.
						<br />
						다음 세션을 준비할 때 참고할게요!
					</p>
				</div>
				<div className="px-4 pb-4">
					<Button type="button" size="full" variant="secondary" onClick={() => router.back()}>
						닫기
					</Button>
				</div>
			</SafeAreaAppLayout>
		);
	}

	return (
		<SafeAreaAppLayout className="h-dvh bg-background-normal">
			<header className="relative flex h-12 shrink-0 items-center justify-center px-4 py-3">
				<button
					type="button"
					aria-label="피드백 닫기"
					onClick={() => router.back()}
					className="absolute left-4 text-label-assistive"
				>
					<X className="size-5" aria-hidden="true" />
				</button>
				<h1 className="font-semibold text-body1 text-label-normal">세션 피드백</h1>
			</header>

			<main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-5">
				<div>
					<p className="font-bold text-headline2 text-label-assistive">{sessionTitle}</p>
					<h2 className="mt-1 font-bold text-headline2 text-label-normal">
						이번 세션에 얼마나 만족하셨나요? <span className="text-primary-normal">*</span>
					</h2>
				</div>

				<fieldset className="mt-6 flex flex-col gap-2">
					<legend className="sr-only">만족도</legend>
					{SATISFACTION_OPTIONS.map((option) => {
						const selected = satisfaction === option.value;

						return (
							<label
								key={option.value}
								className={`flex h-12 cursor-pointer items-center justify-between rounded-lg border px-4 font-medium text-body2 transition-colors ${
									selected
										? 'border-label-normal text-label-normal'
										: 'border-line-normal text-label-assistive'
								}`}
							>
								<input
									type="radio"
									name="satisfaction"
									value={option.value}
									checked={selected}
									onChange={() => setSatisfaction(option.value)}
									className="sr-only"
								/>
								{option.label}
								<span
									className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
										selected
											? 'border-label-normal bg-label-normal'
											: 'border-line-normal bg-background-normal'
									}`}
									aria-hidden="true"
								>
									{selected && <Check className="size-2.5 text-label-inverse" strokeWidth={3} />}
								</span>
							</label>
						);
					})}
				</fieldset>
			</main>

			<footer className="shrink-0 bg-background-normal pb-safe-area">
				<div className="bg-background-subtle px-4 py-4">
					<p className="font-medium text-body2 text-label-tertiary">
						• 이름과 팀은 운영진 결과 화면에 표시되지 않아요.
						<br />
						&nbsp;&nbsp;&nbsp;제출 여부는 미응답 알림에만 활용돼요.
					</p>
				</div>
				<div className="px-4 pt-4 pb-4">
					<div
						className="mb-4 flex gap-1"
						role="progressbar"
						aria-valuemin={1}
						aria-valuemax={4}
						aria-valuenow={1}
						aria-label="피드백 작성 진행률"
					>
						<span className="h-0.5 flex-1 bg-label-normal" />
						<span className="h-0.5 flex-1 bg-line-normal" />
						<span className="h-0.5 flex-1 bg-line-normal" />
						<span className="h-0.5 flex-1 bg-line-normal" />
					</div>
					<Button
						type="button"
						size="full"
						variant="secondary"
						disabled={satisfaction === null}
						className="disabled:bg-background-strong disabled:text-label-assistive disabled:opacity-100"
						onClick={submitFeedback}
					>
						다음
					</Button>
				</div>
			</footer>
		</SafeAreaAppLayout>
	);
};
