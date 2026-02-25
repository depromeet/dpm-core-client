'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import Link from 'next/link';
import { Fragment } from 'react';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';
import { cn } from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { getAfterPartiesQueryOptions } from '@/remotes/queries/after-party';

import { useAfterPartyListFilterSearchParams } from '../_hooks/use-after-party-list-filter-search-params';
import { getDaysUntilDeadline } from '../_utils/get-days-until-deadline';

dayjs.locale('ko');

interface AfterPartyItemProps {
	/** 회식 고유 ID */
	gatheringId: number;
	/** 회식 제목 */
	title: string;
	/** 내가 생성한 회식 여부 */
	isOwner: boolean;
	/** 참석 여부 (null: 미응답) */
	rsvpStatus: boolean | null;
	/** 실제 참석 여부 */
	isAttended: boolean;
	/** 승인 여부 */
	isApproved: boolean;
	/** 마감 여부 */
	isClosed: boolean;
	/** 회식 설명 */
	description: string;
	/** 회식 예정 시간 (ISO string) */
	scheduledAt: string;
	/** 참여 조사 마감 시간 (ISO string) */
	closedAt: string;
	/** 참석 응답 수 */
	isRsvpGoingCount: number;
	/** 실제 참석 수 */
	isAttendedCount: number;
	/** 초대된 인원 수 */
	inviteeCount: number;
	/** 생성 시간 (ISO string) */
	createdAt: string;
}

type AfterPartyLabelType = 'createdByMe' | 'daysUntilDeadline' | 'closed';

interface AfterPartyItemLabelProps {
	/** 라벨 타입 */
	type: AfterPartyLabelType;
	/** N일 뒤 마감일 때 남은 일수 */
	daysLeft?: number;
}

const AfterPartyItemLabel = ({ type, daysLeft }: AfterPartyItemLabelProps) => {
	const styles = {
		base: 'h-[22px] rounded-sm font-caption1 px-[5px] py-[3px] flex items-center justify-center leading-none',
		/** 내가 생성한 회식 */
		createdByMe: 'bg-green-100 text-green-500 ',
		/** N일 뒤 투표 마감 */
		daysUntilDeadline: 'bg-blue-50 text-blue-500',

		closed: 'bg-[#F3F4F6] text-gray-400',
	};

	let text = '';
	switch (type) {
		case 'createdByMe':
			text = '내가 생성한';
			break;
		case 'daysUntilDeadline':
			text = `${daysLeft}일 뒤 투표 마감`;
			break;
		case 'closed':
			text = '마감';
			break;
	}

	return <span className={cn(styles.base, styles[type])}>{text}</span>;
};

const CalendarIcon = () => {
	return (
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
};

const UserIcon = () => {
	return (
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
};

const AfterPartyItem = ({
	gatheringId,
	title,
	isOwner,
	isClosed,
	description,
	closedAt,
	scheduledAt,
	isRsvpGoingCount,
	inviteeCount,
	rsvpStatus,
}: AfterPartyItemProps) => {
	const styles = {
		base: 'p-[16px] font-semibold text-caption1 h-[149px] border-b border-b-line-subtle space-y-[8px]',
		default: 'bg-gray-0',
		closed: 'bg-[#F6F8FA] opacity-70',
		/** rsvpStatus가 null일 때 (미응답) */
		unanswered: 'bg-[#FFFCF7]',
	};

	const daysLeft = getDaysUntilDeadline(closedAt);

	/** 날짜 포맷: "25년 8월 12일 (토)" */
	const formattedDate = dayjs(scheduledAt).format('YY년 M월 D일 (ddd)');

	const bgStyle = isClosed
		? styles.closed
		: rsvpStatus === null
			? styles.unanswered
			: styles.default;

	return (
		<div className="relative">
			<div className={cn(styles.base, bgStyle)}>
				<div className="relative flex items-center justify-between">
					<div className="flex items-center justify-center space-x-[4px]">
						{isClosed ? (
							<AfterPartyItemLabel type="closed" />
						) : (
							<Fragment>
								{isOwner && <AfterPartyItemLabel type="createdByMe" />}
								{daysLeft > 0 && (
									<AfterPartyItemLabel type="daysUntilDeadline" daysLeft={daysLeft} />
								)}
							</Fragment>
						)}
					</div>
				</div>
				<Link href={`/after-party/${gatheringId}/update`} className="block space-y-[8px]">
					<p className="font-semibold text-body1 text-gray-800">{title}</p>
					<p className="text-ellipsis font-medium text-body2 text-gray-600">{description}</p>
				</Link>
				<div className="flex items-center font-medium text-body2 text-gray-400">
					<CalendarIcon />
					<span className="ml-[5px]">{formattedDate}</span>
					<span className="mx-[8px] text-gray-300">·</span>
					<UserIcon />
					<span className="ml-[5px]">
						{isRsvpGoingCount}/{inviteeCount}명 참여 예정
					</span>
				</div>
			</div>
			{/* opacity 영향을 받지 않는 별도 레이어 - rsvpStatus가 null이면 노출 안 함 */}
			{rsvpStatus !== null && (
				<span className="absolute top-[16px] right-[16px] z-20 font-medium text-blue-400 text-caption1">
					{rsvpStatus ? '참석' : '불참 예정'}
				</span>
			)}
		</div>
	);
};

/** rsvpStatus=null 예시용 목 데이터 (개발 시 확인용) */
const MOCK_UNANSWERED_ITEM = {
	gatheringId: 0,
	title: '[예시] 미응답 회식',
	isOwner: false,
	rsvpStatus: null as boolean | null,
	isAttended: false,
	isApproved: false,
	isClosed: false,
	description: 'rsvpStatus가 null일 때 배경색 #FFFCF7이 적용됩니다.',
	scheduledAt: new Date().toISOString(),
	closedAt: dayjs().add(3, 'day').toISOString(),
	isRsvpGoingCount: 5,
	isAttendedCount: 0,
	inviteeCount: 10,
	createdAt: new Date().toISOString(),
};

const AfterPartyListContainer = () => {
	const { afterPartyStatus } = useAfterPartyListFilterSearchParams();
	const {
		data: { data: gatherings },
	} = useSuspenseQuery(getAfterPartiesQueryOptions);

	const filteredList =
		afterPartyStatus === 'ALL'
			? gatherings
			: gatherings.filter((item) => dayjs(item.closedAt).isAfter(dayjs()));

	/** 개발 환경에서 rsvpStatus=null 예시를 목록 맨 위에 표시 */
	const displayList =
		process.env.NODE_ENV === 'development' ? [MOCK_UNANSWERED_ITEM, ...filteredList] : filteredList;

	return (
		<div className="[&_[data-virtuoso-scroller]]:scrollbar-hide h-full">
			<Virtuoso
				style={{ height: '100%' }}
				data={displayList}
				itemContent={(_, item) => {
					return <AfterPartyItem key={item.gatheringId} {...item} />;
				}}
			/>
		</div>
	);
};

const AfterPartyList = ErrorBoundary.with(
	{
		fallback: (props) => <ErrorBox onReset={() => props.reset()} />,
	},
	() => (
		<Suspense fallback={<LoadingBox />}>
			<AfterPartyListContainer />
		</Suspense>
	),
);

export { AfterPartyList };
