'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import Link from 'next/link';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AppLayout, Button, GAPageTracker } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { getAfterPartyByIdQueryOptions } from '@/remotes/queries/after-party';

import { getDaysUntilDeadline } from '../../_utils/get-days-until-deadline';

dayjs.locale('ko');

interface AfterPartyDetailProps {
	gatheringId: number;
}

const CalendarIcon = () => (
	<svg
		width="14"
		height="15"
		viewBox="0 0 14 15"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M3.93333 0C4.2647 0 4.53333 0.268648 4.53333 0.600042V1.33343H8.66667V0.600042C8.66667 0.268648 8.9353 0 9.26667 0C9.59804 0 9.86667 0.268648 9.86667 0.600042V1.33343H11.2667C12.3344 1.33343 13.2 2.19907 13.2 3.26689V12.6009C13.2 13.6687 12.3344 14.5343 11.2667 14.5343H1.93333C0.865583 14.5343 0 13.6687 0 12.6009V3.26689C0 2.19907 0.865583 1.33343 1.93333 1.33343H3.33333V0.600042C3.33333 0.268648 3.60196 0 3.93333 0ZM3.33333 2.53351H1.93333C1.52832 2.53351 1.2 2.86186 1.2 3.26689V5.3337H12V3.26689C12 2.86186 11.6717 2.53351 11.2667 2.53351H9.86667V3.26689C9.86667 3.59829 9.59804 3.86693 9.26667 3.86693C8.9353 3.86693 8.66667 3.59829 8.66667 3.26689V2.53351H4.53333V3.26689C4.53333 3.59829 4.2647 3.86693 3.93333 3.86693C3.60196 3.86693 3.33333 3.59829 3.33333 3.26689V2.53351ZM12 6.53379H1.2V12.6009C1.2 13.0059 1.52832 13.3343 1.93333 13.3343H11.2667C11.6717 13.3343 12 13.0059 12 12.6009V6.53379Z"
			fill="#9CA3AF"
		/>
	</svg>
);

const UserIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M12.6666 14V12.6667C12.6666 11.9594 12.3857 11.2811 11.8856 10.781C11.3855 10.281 10.7072 10 9.99998 10H5.99998C5.29274 10 4.61446 10.281 4.11436 10.781C3.61426 11.2811 3.33331 11.9594 3.33331 12.6667V14"
			stroke="#9CA3AF"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M7.99998 7.33333C9.47274 7.33333 10.6666 6.13943 10.6666 4.66667C10.6666 3.19391 9.47274 2 7.99998 2C6.52722 2 5.33331 3.19391 5.33331 4.66667C5.33331 6.13943 6.52722 7.33333 7.99998 7.33333Z"
			stroke="#9CA3AF"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const AfterPartyDetailContent = ({ gatheringId }: AfterPartyDetailProps) => {
	const {
		data: { data: detail },
	} = useSuspenseQuery(getAfterPartyByIdQueryOptions(gatheringId));

	const daysLeft = getDaysUntilDeadline(detail.closedAt);
	const formattedDate = dayjs(detail.scheduledAt).format('YY년 M월 D일 (ddd)');
	const canEdit = detail.isOwner && !detail.isClosed;

	return (
		<AppLayout className="h-[100dvh] bg-white">
			<GAPageTracker type="after-party-detail" />
			<AppHeader title="회식 상세" backHref="/after-party" className="shrink-0" />

			<div className="flex flex-1 flex-col overflow-y-auto px-[16px] pt-1.5 pb-[24px]">
				{/* 라벨 */}
				<div className="mb-4 flex items-center gap-2">
					{detail.isClosed ? (
						<span className="rounded-sm bg-[#F3F4F6] px-[5px] py-[3px] font-caption1 text-gray-400">
							마감
						</span>
					) : (
						<>
							{detail.isOwner && (
								<span className="rounded-sm bg-green-100 px-[5px] py-[3px] font-caption1 text-green-500">
									내가 생성한
								</span>
							)}
							{daysLeft > 0 && (
								<span className="rounded-sm bg-blue-50 px-[5px] py-[3px] font-caption1 text-blue-500">
									{daysLeft}일 뒤 투표 마감
								</span>
							)}
						</>
					)}
				</div>

				{/* 기본 정보 */}
				<section className="space-y-4">
					<h1 className="font-semibold text-[#111827] text-title2">{detail.title}</h1>
					{detail.description && (
						<p className="font-medium text-[#4B5563] text-body2">{detail.description}</p>
					)}

					<div className="flex items-center gap-2 font-medium text-body2 text-gray-400">
						<CalendarIcon />
						<span>{formattedDate}</span>
						<span className="text-gray-300">·</span>
						<UserIcon />
						<span>
							{detail.isRsvpGoingCount}/{detail.inviteeCount}명 참여 예정
						</span>
					</div>
				</section>

				{/* 수정 버튼 */}
				<div className="mt-auto pt-8">
					{canEdit ? (
						<Button
							asChild
							variant="secondary"
							size="full"
							className="h-[48px] rounded-lg bg-[#1F2937] text-white"
						>
							<Link href={`/after-party/${gatheringId}/update`}>수정하기</Link>
						</Button>
					) : (
						<Button
							variant="secondary"
							size="full"
							className="h-[48px] rounded-lg bg-[#1F2937] text-white"
							disabled
						>
							수정하기
						</Button>
					)}
					{!canEdit && (
						<p className="mt-2 text-center font-medium text-caption1 text-gray-500">
							{detail.isClosed
								? '마감된 회식은 수정할 수 없어요'
								: !detail.isOwner
									? '생성자만 수정할 수 있어요'
									: ''}
						</p>
					)}
				</div>
			</div>
		</AppLayout>
	);
};

const AfterPartyDetail = ErrorBoundary.with(
	{
		fallback: (props) => <ErrorBox onReset={() => props.reset()} />,
	},
	({ gatheringId }: AfterPartyDetailProps) => (
		<Suspense fallback={<LoadingBox />}>
			<AfterPartyDetailContent gatheringId={gatheringId} />
		</Suspense>
	),
);

export { AfterPartyDetail };
