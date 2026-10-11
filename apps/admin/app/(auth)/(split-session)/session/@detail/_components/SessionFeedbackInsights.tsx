'use client';

import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@dpm-core/shared';

import { getSessionFeedbackInsightQuery } from '@/remotes/queries/session';

interface SessionFeedbackInsightsProps {
	sessionId: number;
}

const FeedbackSectionTitle = ({ children }: { children: ReactNode }) => (
	<h3 className="font-semibold text-body1 text-label-normal">{children}</h3>
);

const ReasonGroup = ({
	title,
	items,
	respondentCount,
	etcComments,
	variant,
}: {
	title: string;
	items: readonly { code: string; label: string; count: number; rate: number }[];
	respondentCount: number;
	etcComments: readonly string[];
	variant: 'positive' | 'improvement';
}) => {
	const [isEtcExpanded, setIsEtcExpanded] = useState(false);
	const rankedItems = [...items]
		.filter(({ code, count }) => code !== 'ETC' || count > 0)
		.sort((a, b) => b.count - a.count);
	const topItems = rankedItems.slice(0, 3);
	const otherItems = rankedItems.slice(3);
	const getRate = (count: number) =>
		respondentCount > 0 ? Math.round((count / respondentCount) * 100) : 0;

	return (
		<div className="flex flex-col gap-5 rounded-lg border border-line-subtle p-5">
			<div className="flex flex-col gap-3">
				<p className="font-medium text-body2 text-label-subtle">{title}</p>
				<p className="text-caption1 text-label-assistive">총 {respondentCount}건 · 복수 선택</p>
				<ul className="flex flex-wrap gap-2">
					{topItems.map(({ code, label, count }) => {
						const isEtc = code === 'ETC' && etcComments.length > 0;
						const chipClassName = `whitespace-nowrap rounded-full px-3 py-2 text-center font-medium text-body2 ${variant === 'positive' ? 'bg-primary-extralight text-primary-normal' : 'bg-red-50 text-red-500'}`;

						return (
							<li key={code} className={chipClassName}>
								{isEtc ? (
									<button
										type="button"
										className="flex w-full cursor-pointer items-center justify-center gap-1 whitespace-nowrap"
										aria-expanded={isEtcExpanded}
										aria-controls={`feedback-etc-${variant}`}
										onClick={() => setIsEtcExpanded((expanded) => !expanded)}
									>
										{label} {count}명 ({getRate(count)}%)
										{isEtcExpanded ? (
											<ChevronUp aria-hidden="true" size={14} />
										) : (
											<ChevronDown aria-hidden="true" size={14} />
										)}
									</button>
								) : (
									<>
										{label} {count}명 ({getRate(count)}%)
									</>
								)}
							</li>
						);
					})}
				</ul>
				<ul className="flex flex-wrap gap-2">
					{otherItems.map(({ code, label, count }) => {
						const isEtc = code === 'ETC' && etcComments.length > 0;

						return (
							<li key={code}>
								{isEtc ? (
									<button
										type="button"
										className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full bg-background-subtle px-3 py-2 font-medium text-body2 text-label-tertiary"
										aria-expanded={isEtcExpanded}
										aria-controls={`feedback-etc-${variant}`}
										onClick={() => setIsEtcExpanded((expanded) => !expanded)}
									>
										{label} {count}명 ({getRate(count)}%)
										{isEtcExpanded ? (
											<ChevronUp aria-hidden="true" size={14} />
										) : (
											<ChevronDown aria-hidden="true" size={14} />
										)}
									</button>
								) : (
									<span className="block whitespace-nowrap rounded-full bg-background-subtle px-3 py-2 font-medium text-body2 text-label-tertiary">
										{label} {count}명 ({getRate(count)}%)
									</span>
								)}
							</li>
						);
					})}
				</ul>
			</div>
			{etcComments.length > 0 && (
				<ul
					id={`feedback-etc-${variant}`}
					aria-hidden={!isEtcExpanded}
					className={`${isEtcExpanded ? 'flex' : 'hidden'} list-disc flex-col gap-2 rounded-lg bg-background-subtle px-8 py-3 text-body2 text-label-subtle`}
				>
					{etcComments.map((comment, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: The API returns anonymous comment text without IDs.
						<li key={index}>{comment}</li>
					))}
				</ul>
			)}
		</div>
	);
};

const FreeComment = ({ id, text }: { id: number; text: string }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [hasMore, setHasMore] = useState(false);
	const contentRef = useRef<HTMLParagraphElement>(null);

	useLayoutEffect(() => {
		const element = contentRef.current;
		if (isExpanded || !element) return;

		const updateHasMore = () => {
			const range = document.createRange();
			range.selectNodeContents(element);
			setHasMore(range.getClientRects().length > 5);
		};

		updateHasMore();
		const resizeObserver = new ResizeObserver(updateHasMore);
		resizeObserver.observe(element);
		return () => resizeObserver.disconnect();
	}, [isExpanded]);

	return (
		<li className="flex flex-col items-start gap-1 rounded-lg bg-background-subtle p-4">
			<p
				ref={contentRef}
				id={`feedback-comment-${id}`}
				className={
					isExpanded
						? 'min-w-0 flex-1 text-body2 text-label-subtle'
						: 'line-clamp-5 min-w-0 flex-1 text-body2 text-label-subtle'
				}
			>
				{text}
			</p>
			{hasMore && (
				<Button
					type="button"
					variant="text"
					size="none"
					className="text-caption1 text-label-assistive"
					aria-expanded={isExpanded}
					aria-controls={`feedback-comment-${id}`}
					onClick={() => setIsExpanded((expanded) => !expanded)}
				>
					{isExpanded ? '접기' : '더보기'}
				</Button>
			)}
		</li>
	);
};

export const SessionFeedbackInsights = ({ sessionId }: SessionFeedbackInsightsProps) => {
	const {
		data: { data: insight },
	} = useSuspenseQuery(getSessionFeedbackInsightQuery(sessionId));
	const feedbackStatusLabel = {
		SCHEDULED: '수집 예정',
		IN_PROGRESS: '수집 중',
		CLOSED: '수집 완료',
	}[insight.status];
	const feedbackPeriod = `${dayjs(insight.startAt).format('YYYY.MM.DD')} ~ ${dayjs(insight.endAt).format('YYYY.MM.DD')}`;
	const highestSatisfactionCount = Math.max(
		...insight.satisfaction.distribution.map(({ count }) => count),
	);
	const hasResponses = insight.responseSummary.respondentCount > 0;

	return (
		<div className="flex flex-col gap-10 pb-8">
			<header className="flex flex-col gap-1">
				<h2 className="font-bold text-label-normal text-title1">{insight.sessionName}</h2>
				<p className="font-semibold text-body2 text-label-assistive">
					{feedbackStatusLabel}
					{` · ${feedbackPeriod}`}
				</p>
			</header>

			{!hasResponses ? (
				<div className="flex min-h-[320px] items-center justify-center rounded-lg bg-background-subtle text-body2 text-label-assistive">
					아직 제출된 피드백이 없습니다.
				</div>
			) : (
				<div className="flex flex-col gap-12">
					<div className="flex flex-col gap-3">
						<section aria-labelledby="feedback-response-heading" className="flex flex-col gap-3">
							<FeedbackSectionTitle>
								<span id="feedback-response-heading">응답 현황</span>
							</FeedbackSectionTitle>
							<div className="grid grid-cols-2 gap-3">
								<div className="flex h-[92px] flex-col justify-center gap-2.5 rounded-lg bg-background-subtle p-5">
									<p className="font-semibold text-caption1 text-label-subtle">응답률</p>
									<p className="font-semibold text-headline1 text-label-normal">
										{insight.responseSummary.responseRate}% ·{' '}
										{insight.responseSummary.respondentCount}/{insight.responseSummary.targetCount}
										명
									</p>
								</div>
								<div className="flex h-[92px] flex-col justify-center gap-2.5 rounded-lg bg-background-subtle p-5">
									<p className="font-semibold text-caption1 text-label-subtle">평균 만족도</p>
									<p className="font-semibold text-headline1 text-label-normal">
										{insight.satisfaction.average}점 / {insight.satisfaction.maxScore}점
									</p>
								</div>
							</div>
						</section>

						<section
							aria-labelledby="feedback-distribution-heading"
							className="flex h-[232px] flex-col gap-5 rounded-lg border border-line-subtle p-5"
						>
							<h3
								id="feedback-distribution-heading"
								className="font-semibold text-body2 text-label-subtle"
							>
								만족도 분포
							</h3>
							<ul className="flex flex-col gap-2">
								{insight.satisfaction.distribution.map(({ code, label, count, rate }) => {
									return (
										<li
											key={code}
											className="grid grid-cols-[80px_minmax(0,1fr)_70px] items-center gap-3"
										>
											<span className="truncate font-semibold text-caption1 text-label-assistive">
												{label}
											</span>
											<div
												role="img"
												aria-label={`${label}: ${count}명, ${rate}%`}
												className="h-6 overflow-hidden rounded-md bg-background-subtle"
											>
												<div
													className={`h-full rounded-md ${highestSatisfactionCount > 0 && count === highestSatisfactionCount ? 'bg-primary-normal' : 'bg-primary-light'}`}
													style={{ width: `${rate}%` }}
												/>
											</div>
											<span className="text-right font-semibold text-caption1 text-label-subtle">
												{count}명 <span className="text-label-assistive">· {rate}%</span>
											</span>
										</li>
									);
								})}
							</ul>
						</section>
					</div>

					<section aria-labelledby="feedback-reasons-heading" className="flex flex-col gap-5">
						<FeedbackSectionTitle>
							<span id="feedback-reasons-heading">피드백 항목</span>
						</FeedbackSectionTitle>
						<div className="flex flex-col gap-3">
							<ReasonGroup
								title="이런 점이 좋았어요"
								items={insight.likedAspects.items}
								respondentCount={insight.likedAspects.respondentCount}
								etcComments={insight.likedAspects.etcComments}
								variant="positive"
							/>
							<ReasonGroup
								title="이런 점이 별로였어요"
								items={insight.improvementAspects.items}
								respondentCount={insight.improvementAspects.respondentCount}
								etcComments={insight.improvementAspects.etcComments}
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
								세션 자유 의견{' '}
								<span className="text-primary-strong">{insight.freeComments.count}건</span>
							</h4>
							<ul aria-label="익명 세션 자유 의견" className="flex flex-col gap-2 py-4">
								{insight.freeComments.items.map((text, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: The API returns ordered anonymous comments without IDs.
									<FreeComment key={index} id={index} text={text} />
								))}
							</ul>
						</div>
					</section>
				</div>
			)}
		</div>
	);
};
