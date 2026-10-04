'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode, useState } from 'react';
import { Check, Minus, X } from 'lucide-react';
import {
	Button,
	cn,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	FilterChip,
} from '@dpm-core/shared';

import { SafeAreaAppLayout } from '@/components/app-layout';
import {
	type FeedbackSubmissionMockResult,
	type SessionFeedbackSubmission,
	submitSessionFeedbackMock,
} from '@/remotes/mutations/session-feedback';
import type { SessionFeedbackStatus } from '@/remotes/queries/session-feedback';

interface FeedbackFormProps {
	sessionId: number;
	sessionTitle: string;
	returnTo: '/' | '/session';
	mockSubmissionResult?: FeedbackSubmissionMockResult;
	feedbackStatus: SessionFeedbackStatus;
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

const NO_FEEDBACK_REASON = '특별히 없음';

const POSITIVE_FEEDBACK_OPTIONS = [
	'세션 내용',
	'진행 방식·시간',
	'교류 기회',
	'사전·현장 안내',
	'장소·접속 환경',
	'기타',
	NO_FEEDBACK_REASON,
] as const;

const FEEDBACK_STATUS_CONTENT = {
	SUBMITTED: { title: '이미 피드백을 제출했어요.', icon: 'check' },
	EXPIRED: { title: '피드백 응답 기간이 끝났어요.', icon: 'warning' },
	NOT_TARGET: { title: '이 세션의 피드백 대상이 아니에요.', icon: 'warning' },
} as const;

const getFeedbackStepIndex = (step: FeedbackStep) => FEEDBACK_STEPS.indexOf(step);

interface FeedbackResultScreenProps {
	icon: ReactNode;
	title: string;
	description?: ReactNode;
	actionLabel: string;
	onAction: () => void;
	disabled?: boolean;
}

const FeedbackResultScreen = ({
	icon,
	title,
	description,
	actionLabel,
	onAction,
	disabled = false,
}: FeedbackResultScreenProps) => (
	<SafeAreaAppLayout className="h-dvh bg-background-normal">
		<div className="flex flex-1 items-center justify-center px-4">
			<div className="flex flex-col items-center gap-6 text-center">
				{icon}
				<div className="flex flex-col items-center gap-3">
					<h1 className="font-bold text-[#1A1C1E] text-headline2">{title}</h1>
					{description ? (
						<p className="font-medium text-body1 text-label-subtle">{description}</p>
					) : null}
				</div>
			</div>
		</div>
		<div className="px-4 py-4">
			<Button
				type="button"
				size="full"
				variant="secondary"
				className="h-12 rounded-lg"
				disabled={disabled}
				onClick={onAction}
			>
				{actionLabel}
			</Button>
		</div>
	</SafeAreaAppLayout>
);

export const FeedbackForm = ({
	sessionId,
	sessionTitle,
	returnTo,
	mockSubmissionResult,
	feedbackStatus,
}: FeedbackFormProps) => {
	const router = useRouter();
	const [step, setStep] = useState<FeedbackStep>('satisfaction');
	const [satisfaction, setSatisfaction] = useState<number | null>(null);
	const [positiveReasons, setPositiveReasons] = useState<string[]>([]);
	const [improvementReasons, setImprovementReasons] = useState<string[]>([]);
	const [comment, setComment] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [submissionFailed, setSubmissionFailed] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

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
			if (reason === NO_FEEDBACK_REASON) return [reason];
			if (current.length >= 2) return current;
			return [...current.filter((item) => item !== NO_FEEDBACK_REASON), reason];
		});
	};

	const goPrevious = () => {
		if (step === 'satisfaction') {
			router.back();
			return;
		}

		setStep(FEEDBACK_STEPS[stepIndex - 1]);
	};

	const submitFeedback = async () => {
		if (isSubmitting) return;

		const payload: SessionFeedbackSubmission = {
			sessionId,
			satisfaction: satisfaction ?? 0,
			positiveReasons,
			improvementReasons,
			comment,
		};

		setIsSubmitting(true);
		try {
			if (process.env.NEXT_PUBLIC_STAGE !== 'development') {
				throw new Error('Session feedback submission is unavailable outside development.');
			}
			await submitSessionFeedbackMock(payload, mockSubmissionResult ?? 'success');
			setSubmissionFailed(false);
			setSubmitted(true);
		} catch {
			setSubmissionFailed(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	const goNext = () => {
		if (!canMoveNext) return;
		if (stepIndex < FEEDBACK_STEPS.length - 1) {
			setStep(FEEDBACK_STEPS[stepIndex + 1]);
			return;
		}

		void submitFeedback();
	};

	if (feedbackStatus !== 'AVAILABLE') {
		const statusContent = FEEDBACK_STATUS_CONTENT[feedbackStatus];
		const isSubmitted = statusContent.icon === 'check';

		return (
			<FeedbackResultScreen
				icon={
					<div
						className={cn(
							'flex size-[52px] items-center justify-center rounded-full',
							isSubmitted ? 'bg-primary-normal/30' : 'bg-[#FEC15E]/30',
						)}
					>
						<span
							className={cn(
								'flex size-5 items-center justify-center rounded-full',
								isSubmitted ? 'bg-primary-normal' : 'bg-[#FEC15E]',
							)}
						>
							{isSubmitted ? (
								<Check className="size-3 text-white" strokeWidth={3} aria-hidden="true" />
							) : (
								<Minus className="size-3 text-white" strokeWidth={3} aria-hidden="true" />
							)}
						</span>
					</div>
				}
				title={statusContent.title}
				actionLabel="닫기"
				onAction={() => router.replace('/')}
			/>
		);
	}

	if (submissionFailed) {
		return (
			<FeedbackResultScreen
				icon={
					<div className="flex size-[52px] items-center justify-center rounded-full bg-[#FEC15E]/30">
						<span className="flex size-5 items-center justify-center rounded-full bg-[#FEC15E]">
							<Minus className="size-3 text-white" strokeWidth={3} aria-hidden="true" />
						</span>
					</div>
				}
				title="피드백을 제출하지 못했어요."
				description="잠시 후 다시 시도해 주세요."
				actionLabel={isSubmitting ? '제출 중...' : '다시 시도'}
				disabled={isSubmitting}
				onAction={() => void submitFeedback()}
			/>
		);
	}

	if (submitted) {
		return (
			<FeedbackResultScreen
				icon={
					<div className="flex size-[52px] items-center justify-center rounded-full bg-primary-normal/20">
						<span className="flex size-8 items-center justify-center rounded-full bg-primary-normal">
							<Check className="size-4 text-label-inverse" strokeWidth={3} aria-hidden="true" />
						</span>
					</div>
				}
				title="피드백을 제출했어요."
				description={
					<>
						소중한 의견 감사해요.
						<br />
						다음 세션을 준비할 때 참고할게요!
					</>
				}
				actionLabel="닫기"
				onAction={() => router.replace(returnTo)}
			/>
		);
	}

	return (
		<SafeAreaAppLayout className="h-dvh bg-background-normal">
			<header className="relative flex h-12 shrink-0 items-center justify-center px-4 py-3">
				<button
					type="button"
					aria-label="피드백 닫기"
					onClick={() => setIsExitDialogOpen(true)}
					className="absolute left-4 cursor-pointer text-label-assistive"
				>
					<X className="size-6" aria-hidden="true" />
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
									className={cn(
										'flex h-12 cursor-pointer items-center justify-between rounded-lg border px-4 font-medium text-body2 transition-colors',
										selected
											? 'border-label-normal text-label-normal'
											: 'border-line-normal text-label-assistive',
									)}
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
										className={cn(
											'flex size-4 shrink-0 items-center justify-center rounded-full border',
											selected
												? 'border-label-normal bg-label-normal'
												: 'border-line-normal bg-background-normal',
										)}
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
								className={cn(
									'h-0.5 flex-1',
									index <= stepIndex ? 'bg-label-normal' : 'bg-line-normal',
								)}
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
			<Dialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
				<DialogContent
					showCloseButton={false}
					overlayClassName="inset-y-0 right-auto left-1/2 w-full max-w-lg -translate-x-1/2"
					className="w-[calc(100%-2rem)] gap-5 rounded-[20px] p-5 min-[512px]:w-[480px]"
				>
					<DialogHeader className="gap-2 text-left">
						<DialogTitle className="font-bold text-label-normal text-title1">
							피드백을 그만둘까요?
						</DialogTitle>
						<DialogDescription className="font-medium text-body2 text-label-subtle">
							작성중인 내용이 사라져요.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2">
						<div className="min-w-0 flex-1">
							<Button
								type="button"
								size="full"
								variant="assistive"
								className="h-12 rounded-lg"
								onClick={() => setIsExitDialogOpen(false)}
							>
								취소
							</Button>
						</div>
						<div className="min-w-0 flex-1">
							<Button
								type="button"
								size="full"
								variant="secondary"
								className="h-12 rounded-lg"
								onClick={() => router.replace(returnTo)}
							>
								그만두기
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</SafeAreaAppLayout>
	);
};
