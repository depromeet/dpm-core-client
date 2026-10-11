'use client';

import { type ReactNode, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@dpm-core/shared';

import { getSessionDetailQuery } from '@/remotes/queries/session';

interface SessionFeedbackInsightsProps {
	sessionId: number;
}

const FEEDBACK_MOCK = {
	respondentCount: 24,
	targetCount: 40,
	averageSatisfaction: 4.2,
	satisfaction: [
		{ label: '매우 만족', count: 12 },
		{ label: '만족', count: 7 },
		{ label: '보통', count: 3 },
		{ label: '불만족', count: 1 },
		{ label: '매우 불만족', count: 1 },
	],
	positiveReasons: ['세션 내용', '진행 속도', '참여·교류 기회'],
	improvementReasons: ['사전 안내', '장소·접속 환경', '기타'],
	comments: [
		{
			id: 1,
			text: '활동 방향을 이해하는 데 도움이 되었어요. 다른 팀과 이야기할 시간이 조금 더 있으면 좋겠어요.',
		},
		{
			id: 2,
			text: '세션 내용이 유익했고 진행도 좋았습니다. 다음에는 질의응답 시간이 조금 더 길면 좋겠습니다.',
		},
		{
			id: 3,
			text: '팀원들과 자연스럽게 교류할 수 있어서 좋았어요. 안내 내용도 사전에 확인하기 쉬웠습니다.',
		},
		{
			id: 4,
			text: '세션에서 다룬 주제가 흥미로웠고 실제 활동 방향을 잡는 데 도움이 됐습니다.',
		},
		{
			id: 5,
			text: '진행 속도가 적당해서 내용을 따라가기 좋았습니다. 다음 세션도 기대돼요.',
		},
		{
			id: 6,
			text: '현장 안내를 조금 더 일찍 공유해주시면 처음 참석하는 사람에게 도움이 될 것 같습니다.',
		},
		{
			id: 7,
			text: '다른 직군의 디퍼들과 이야기할 수 있는 시간이 인상적이었습니다.',
		},
		{
			id: 8,
			text: '장소를 찾는 데 시간이 걸려서 위치 안내가 조금 더 자세하면 좋겠습니다.',
		},
		{
			id: 9,
			text: '전체적으로 만족스러웠고 다음에는 소그룹 대화 시간이 조금 더 길면 좋겠어요.',
		},
	],
} as const;

const MAX_SATISFACTION_COUNT = Math.max(...FEEDBACK_MOCK.satisfaction.map(({ count }) => count));

const FeedbackSectionTitle = ({ children }: { children: ReactNode }) => (
	<h3 className="font-semibold text-body2 text-label-normal">{children}</h3>
);

const ReasonGroup = ({
	title,
	reasons,
	variant,
}: {
	title: string;
	reasons: readonly string[];
	variant: 'positive' | 'improvement';
}) => (
	<div>
		<p className="font-medium text-body2 text-label-subtle">
			{title} <span className="text-label-assistive">(top 3)</span>
		</p>
		<ul className="mt-3 flex flex-wrap gap-2">
			{reasons.map((reason) => (
				<li
					key={reason}
					className={
						variant === 'positive'
							? 'rounded-full border border-blue-100 bg-blue-50 px-3 py-2 font-medium text-blue-500 text-body2'
							: 'rounded-full border border-red-100 bg-red-50 px-3 py-2 font-medium text-body2 text-red-500'
					}
				>
					{reason}
				</li>
			))}
		</ul>
	</div>
);

const FreeComment = ({ id, text }: { id: number; text: string }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<li className="flex items-start justify-between gap-4 border-line-subtle border-b py-4 last:border-b-0">
			<p
				id={`feedback-comment-${id}`}
				className={
					isExpanded
						? 'min-w-0 flex-1 text-body2 text-label-subtle'
						: 'min-w-0 flex-1 truncate text-body2 text-label-subtle'
				}
			>
				{text}
			</p>
			<Button
				type="button"
				variant="text"
				size="none"
				className="gap-1 text-caption1"
				aria-expanded={isExpanded}
				aria-controls={`feedback-comment-${id}`}
				onClick={() => setIsExpanded((expanded) => !expanded)}
			>
				{isExpanded ? '접기' : '전문 보기'}
				{isExpanded ? (
					<ChevronUp aria-hidden="true" size={14} />
				) : (
					<ChevronDown aria-hidden="true" size={14} />
				)}
			</Button>
		</li>
	);
};

export const SessionFeedbackInsights = ({ sessionId }: SessionFeedbackInsightsProps) => {
	const {
		data: { data: sessionDetail },
	} = useSuspenseQuery(getSessionDetailQuery(sessionId));
	const responseRate = Math.round(
		(FEEDBACK_MOCK.respondentCount / FEEDBACK_MOCK.targetCount) * 100,
	);
	const feedbackStatusLabel = sessionDetail.feedback
		? {
				SCHEDULED: '수집 예정',
				IN_PROGRESS: '수집 중',
				CLOSED: '수집 완료',
			}[sessionDetail.feedback.status]
		: '피드백 미설정';
	const feedbackPeriod = sessionDetail.feedback
		? `${dayjs(sessionDetail.feedback.startAt).format('YYYY.MM.DD')} ~ ${dayjs(sessionDetail.feedback.endAt).format('YYYY.MM.DD')}`
		: null;

	return (
		<div className="flex flex-col gap-6 pb-8">
			<header>
				<h2 className="font-bold text-label-normal text-title1">{sessionDetail.name}</h2>
				<p className="mt-1 font-medium text-caption1 text-label-assistive">
					{feedbackStatusLabel}
					{feedbackPeriod && ` · ${feedbackPeriod}`}
				</p>
			</header>

			<section aria-labelledby="feedback-response-heading" className="flex flex-col gap-3">
				<FeedbackSectionTitle>
					<span id="feedback-response-heading">응답 현황</span>
				</FeedbackSectionTitle>
				<div className="grid grid-cols-2 gap-3">
					<div className="rounded-lg bg-background-subtle p-4">
						<p className="font-medium text-caption1 text-label-subtle">응답률</p>
						<p className="mt-1 font-semibold text-label-normal text-title2">
							{responseRate}% · {FEEDBACK_MOCK.respondentCount}/{FEEDBACK_MOCK.targetCount}명
						</p>
					</div>
					<div className="rounded-lg bg-background-subtle p-4">
						<p className="font-medium text-caption1 text-label-subtle">평균 만족도</p>
						<p className="mt-1 font-semibold text-label-normal text-title2">
							{FEEDBACK_MOCK.averageSatisfaction}점 / 5점
						</p>
					</div>
				</div>
			</section>

			<section
				aria-labelledby="feedback-distribution-heading"
				className="rounded-lg border border-line-subtle p-4"
			>
				<FeedbackSectionTitle>
					<span id="feedback-distribution-heading">만족도 분포</span>
				</FeedbackSectionTitle>
				<ul className="mt-4 flex flex-col gap-3">
					{FEEDBACK_MOCK.satisfaction.map(({ label, count }) => {
						const percentage = Math.round((count / FEEDBACK_MOCK.respondentCount) * 100);

						return (
							<li
								key={label}
								className="grid grid-cols-[72px_minmax(0,1fr)_72px] items-center gap-3"
							>
								<span className="truncate font-medium text-caption1 text-label-assistive">
									{label}
								</span>
								<div
									role="img"
									aria-label={`${label}: ${count}명, ${percentage}%`}
									className="h-3 overflow-hidden rounded-sm bg-background-subtle"
								>
									<div
										className="h-full rounded-sm bg-blue-300"
										style={{ width: `${(count / MAX_SATISFACTION_COUNT) * 100}%` }}
									/>
								</div>
								<span className="text-right font-medium text-caption1 text-label-assistive">
									{count}명 | {percentage}%
								</span>
							</li>
						);
					})}
				</ul>
			</section>

			<section
				aria-labelledby="feedback-reasons-heading"
				className="rounded-lg border border-line-subtle p-4"
			>
				<FeedbackSectionTitle>
					<span id="feedback-reasons-heading">보완 요청 항목</span>
				</FeedbackSectionTitle>
				<div className="mt-5 flex flex-col gap-8">
					<ReasonGroup
						title="이런 점이 좋았어요"
						reasons={FEEDBACK_MOCK.positiveReasons}
						variant="positive"
					/>
					<ReasonGroup
						title="이런 점이 별로였어요"
						reasons={FEEDBACK_MOCK.improvementReasons}
						variant="improvement"
					/>
				</div>
			</section>

			<section aria-labelledby="feedback-comments-heading" className="flex flex-col gap-3">
				<FeedbackSectionTitle>
					<span id="feedback-comments-heading">자유 의견</span>
				</FeedbackSectionTitle>
				<div className="rounded-lg border border-line-subtle px-4">
					<h4 className="border-line-subtle border-b py-4 font-semibold text-caption1 text-label-subtle">
						세션 자유 의견 <span className="text-primary-strong">9건</span>
					</h4>
					<ul aria-label="익명 세션 자유 의견">
						{FEEDBACK_MOCK.comments.map((comment) => (
							<FreeComment key={comment.id} {...comment} />
						))}
					</ul>
				</div>
			</section>
		</div>
	);
};
