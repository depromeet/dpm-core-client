'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button, FilterChip } from '@dpm-core/shared';

import { SafeAreaAppLayout } from '@/components/app-layout';

interface FeedbackFormProps {
	sessionId: number;
	sessionTitle: string;
	returnTo: '/' | '/session';
}

type FeedbackStep = 'satisfaction' | 'positive' | 'improvement' | 'comment';

const FEEDBACK_STEPS: FeedbackStep[] = ['satisfaction', 'positive', 'improvement', 'comment'];

const SATISFACTION_OPTIONS = [
	{ value: 5, label: '매우 만족했어요.' },
	{ value: 4, label: '만족했어요.' },
	{ value: 3, label: '보통이었어요.' },
	{ value: 2, label: '별로였어요.' },
	{ value: 1, label: '매우 별로였어요.' },
] as const;

const POSITIVE_FEEDBACK_OPTIONS = [
	'세션 내용',
	'진행 방식·시간',
	'교류 기회',
	'사전·현장 안내',
	'장소·접속 환경',
	'기타',
	'특별히 없음',
] as const;

const getFeedbackStepIndex = (step: FeedbackStep) => FEEDBACK_STEPS.indexOf(step);

export const FeedbackForm = ({
	sessionId: _sessionId,
	sessionTitle,
	returnTo,
}: FeedbackFormProps) => {
	const router = useRouter();
	const [step, setStep] = useState<FeedbackStep>('satisfaction');
	const [satisfaction, setSatisfaction] = useState<number | null>(null);
	const [positiveReasons, setPositiveReasons] = useState<string[]>([]);
	const [improvementReasons, setImprovementReasons] = useState<string[]>([]);
	const [comment, setComment] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const stepIndex = getFeedbackStepIndex(step);
	const canMoveNext =
		step === 'satisfaction'
			? satisfaction !== null
			: step === 'positive'
				? positiveReasons.length > 0
				: step === 'improvement'
					? improvementReasons.length > 0
					: true;

	const toggleReason = (reason: string, target: 'positive' | 'improvement') => {
		const setReasons = target === 'positive' ? setPositiveReasons : setImprovementReasons;
		setReasons((current) => {
			if (current.includes(reason)) return current.filter((item) => item !== reason);
			if (current.length >= 2) return current;
			return [...current, reason];
		});
	};

	const goPrevious = () => {
		if (step === 'satisfaction') {
			router.back();
			return;
		}

		setStep(FEEDBACK_STEPS[stepIndex - 1]);
	};

	const goNext = () => {
		if (!canMoveNext) return;
		if (stepIndex < FEEDBACK_STEPS.length - 1) {
			setStep(FEEDBACK_STEPS[stepIndex + 1]);
			return;
		}

		// TODO: API 명세 확정 후 제출 mutation을 연결합니다.
		setSubmitted(true);
	};

	if (submitted) {
		return (
			<SafeAreaAppLayout className="h-dvh bg-background-normal">
				<div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
					<div className="mb-6 flex size-[52px] items-center justify-center rounded-full bg-primary-normal/20">
						<span className="flex size-8 items-center justify-center rounded-full bg-primary-normal">
							<Check className="size-4 text-label-inverse" strokeWidth={3} aria-hidden="true" />
						</span>
					</div>
					<h1 className="font-bold text-[#1A1C1E] text-headline2">피드백을 제출했어요.</h1>
					<p className="mt-3 font-medium text-body1 text-label-subtle">
						소중한 의견 감사해요.
						<br />
						다음 세션을 준비할 때 참고할게요!
					</p>
				</div>
				<div className="px-4 py-4">
					<Button
						type="button"
						size="full"
						variant="secondary"
						className="h-12 rounded-lg"
						onClick={() => router.replace(returnTo)}
					>
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
					{step === 'satisfaction' ? (
						<>
							<p className="font-bold text-headline2 text-label-assistive">{sessionTitle}</p>
							<h2 className="mt-1 font-bold text-headline2 text-label-normal">
								이번 세션에 얼마나 만족하셨나요? <span className="text-primary-normal">*</span>
							</h2>
						</>
					) : step === 'positive' ? (
						<>
							<h2 className="font-bold text-headline2 text-label-normal">
								이번 세션에서 특히 좋았던 부분이 있었나요?{' '}
								<span className="text-primary-normal">*</span>
							</h2>
							<p className="mt-2 font-medium text-body1 text-label-subtle">
								최대 2개까지 선택해주세요.
							</p>
						</>
					) : step === 'improvement' ? (
						<>
							<h2 className="font-bold text-headline2 text-label-normal">
								이번 세션에서 개선이 필요한 부분이 있었나요?{' '}
								<span className="text-primary-normal">*</span>
							</h2>
							<p className="mt-2 font-medium text-body1 text-label-subtle">
								최대 2개까지 선택해주세요.
							</p>
						</>
					) : (
						<h2 className="font-bold text-headline2 text-label-normal">
							세션에 대해 더 전하고 싶은 이야기가 있나요?
						</h2>
					)}
				</div>

				{step === 'satisfaction' && (
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
				)}

				{step === 'positive' && (
					<fieldset className="mt-5 flex flex-wrap gap-2">
						<legend className="sr-only">좋았던 부분</legend>
						{POSITIVE_FEEDBACK_OPTIONS.map((reason) => (
							<FilterChip
								key={reason}
								id={`positive-${reason}`}
								checked={positiveReasons.includes(reason)}
								onCheckedChange={() => toggleReason(reason, 'positive')}
							>
								{reason}
							</FilterChip>
						))}
					</fieldset>
				)}

				{step === 'improvement' && (
					<fieldset className="mt-5 flex flex-wrap gap-2">
						<legend className="sr-only">개선이 필요한 부분</legend>
						{POSITIVE_FEEDBACK_OPTIONS.map((reason) => (
							<FilterChip
								key={reason}
								id={`improvement-${reason}`}
								checked={improvementReasons.includes(reason)}
								onCheckedChange={() => toggleReason(reason, 'improvement')}
							>
								{reason}
							</FilterChip>
						))}
					</fieldset>
				)}

				{step === 'comment' && (
					<textarea
						value={comment}
						onChange={(event) => setComment(event.target.value)}
						placeholder="앞에서 고른 항목의 이유나 그 밖의 의견을 자유롭게 남겨주세요. (선택)"
						maxLength={500}
						className="mt-5 h-[100px] w-full resize-none rounded-lg border border-line-normal p-3 font-medium text-body2 text-label-normal outline-none placeholder:text-label-assistive"
					/>
				)}
			</main>

			<footer className="shrink-0 bg-background-normal pb-safe-area">
				{(step === 'satisfaction' || step === 'comment') && (
					<div className="bg-background-subtle px-4 py-4">
						<p className="font-medium text-body2 text-label-tertiary">
							• 이름과 팀은 운영진 결과 화면에 표시되지 않아요.
							<br />
							&nbsp;&nbsp;&nbsp;제출 여부는 미응답 알림에만 활용돼요.
						</p>
					</div>
				)}
				<div className="px-4 pt-4 pb-4">
					<div
						className="mb-4 flex gap-1"
						role="progressbar"
						aria-valuemin={1}
						aria-valuemax={4}
						aria-valuenow={stepIndex + 1}
						aria-label="피드백 작성 진행률"
					>
						{FEEDBACK_STEPS.map((feedbackStep, index) => (
							<span
								key={feedbackStep}
								className={`h-0.5 flex-1 ${index <= stepIndex ? 'bg-label-normal' : 'bg-line-normal'}`}
							/>
						))}
					</div>
					<div className="flex gap-2">
						{stepIndex > 0 && (
							<div className="w-[100px] shrink-0">
								<Button
									type="button"
									size="full"
									variant="assistive"
									className="rounded-lg"
									onClick={goPrevious}
								>
									이전
								</Button>
							</div>
						)}
						<div className="min-w-0 flex-1">
							<Button
								type="button"
								size="full"
								variant="secondary"
								disabled={!canMoveNext}
								className="rounded-lg disabled:bg-background-strong disabled:text-label-assistive disabled:opacity-100"
								onClick={goNext}
							>
								{step === 'comment' ? '제출하기' : '다음'}
							</Button>
						</div>
					</div>
				</div>
			</footer>
		</SafeAreaAppLayout>
	);
};
