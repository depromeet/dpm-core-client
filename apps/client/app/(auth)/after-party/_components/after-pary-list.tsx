'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import Link from 'next/link';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { Virtuoso } from 'react-virtuoso';
import { cn } from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';

import { useAfterPartyListFilterSearchParams } from '../_hooks/use-after-party-list-filter-search-pararms';
import { getDaysUntilDeadline } from '../_utils/get-days-until-deadline';

dayjs.locale('ko');

interface AfterPartyItemProps {
	/** 회식 고유 ID */
	gatheringId: number;
	/** 회식 제목 */
	title: string;
	/** 내가 생성한 회식 여부 */
	isOwner: boolean;
	/** 참석 여부 */
	rsvpStatus: boolean;
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

type AfterPartyLabelType = 'createdByMe' | 'daysUntilDeadline';

interface AfterPartyItemLabelProps {
	/** 라벨 타입 */
	type: AfterPartyLabelType;
	/** N일 뒤 마감일 때 남은 일수 */
	daysLeft?: number;
}

const AfterPartyItemLabel = ({ type, daysLeft }: AfterPartyItemLabelProps) => {
	const styles = {
		base: 'h-[22px] rounded-sm font-caption1 px-[5px] py-[3px] inline-block',
		/** 내가 생성한 회식 */
		createdByMe: 'bg-green-100 text-green-500 ',
		/** N일 뒤 투표 마감 */
		daysUntilDeadline: 'bg-blue-50 text-blue-500',
	};

	const text = type === 'createdByMe' ? '내가 생성한' : `${daysLeft}일 뒤 투표 마감`;

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
	description,
	closedAt,
	scheduledAt,
	isRsvpGoingCount,
	inviteeCount,
	rsvpStatus,
}: AfterPartyItemProps) => {
	const styles = {
		base: 'bg-gray-0 p-[16px] font-semibold text-caption1 h-[149px] border-b border-b-line-subtle space-y-[8px]',
		yellow: 'bg-[#FFFCF7]',
		gray: 'bg-gray-50',
	};

	const daysLeft = getDaysUntilDeadline(closedAt);

	/** 날짜 포맷: "25년 8월 12일 (토)" */
	const formattedDate = dayjs(scheduledAt).format('YY년 M월 D일 (ddd)');

	return (
		<div className={cn(styles.base)}>
			<div className="relative flex items-center justify-between">
				<div className="space-x-[4px]">
					{isOwner && <AfterPartyItemLabel type="createdByMe" />}
					{daysLeft > 0 && <AfterPartyItemLabel type="daysUntilDeadline" daysLeft={daysLeft} />}
				</div>
				<span className="font-medium text-blue-400 text-caption1">
					{rsvpStatus ? '참석' : '참석 예정'}
				</span>
			</div>
			<Link href={`/after-party/${gatheringId}`} className="block space-y-[8px]">
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
	);
};

const AfterPartyListContainer = () => {
	const { afterPartyStatus } = useAfterPartyListFilterSearchParams();
	const filteredList =
		afterPartyStatus === 'ALL'
			? STAFF_TOGETHER_LIST
			: STAFF_TOGETHER_LIST.filter((item) => dayjs(item.closedAt).isAfter(dayjs()));

	return (
		<div className="[&_[data-virtuoso-scroller]]:scrollbar-hide h-full">
			<Virtuoso
				style={{ height: '100%' }}
				data={filteredList}
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

const STAFF_TOGETHER_LIST: AfterPartyItemProps[] = [
	// === 마감된 회식 (과거) ===
	{
		gatheringId: 101,
		title: '12월 송년회',
		isOwner: false,
		rsvpStatus: true,
		isAttended: true,
		isClosed: true,
		isApproved: true,
		description: '2025년을 마무리하는 송년회였습니다. 즐거운 시간이었어요!',
		scheduledAt: '2025-12-20T19:00:00.000',
		closedAt: '2025-12-18T18:00:00.000',
		isRsvpGoingCount: 22,
		isAttendedCount: 20,
		inviteeCount: 25,
		createdAt: '2025-12-01T10:00:00.000',
	},
	{
		gatheringId: 102,
		title: '프론트엔드팀 회식',
		isOwner: true,
		rsvpStatus: true,
		isAttended: true,
		isClosed: true,
		isApproved: true,
		description: '프론트엔드팀 분기별 회식이었습니다.',
		scheduledAt: '2025-12-28T19:30:00.000',
		closedAt: '2025-12-26T12:00:00.000',
		isRsvpGoingCount: 6,
		isAttendedCount: 5,
		inviteeCount: 8,
		createdAt: '2025-12-10T14:30:00.000',
	},
	{
		gatheringId: 103,
		title: '1월 신입 환영회',
		isOwner: false,
		rsvpStatus: true,
		isAttended: true,
		isClosed: true,
		isApproved: true,
		description: '1월 신입사원들을 환영하는 회식이었습니다.',
		scheduledAt: '2026-01-10T18:30:00.000',
		closedAt: '2026-01-08T18:00:00.000',
		isRsvpGoingCount: 15,
		isAttendedCount: 14,
		inviteeCount: 20,
		createdAt: '2025-12-28T09:00:00.000',
	},
	{
		gatheringId: 104,
		title: '백엔드팀 회식',
		isOwner: false,
		rsvpStatus: false,
		isAttended: false,
		isClosed: true,
		isApproved: true,
		description: '참석하지 못한 백엔드팀 회식입니다.',
		scheduledAt: '2026-01-17T19:00:00.000',
		closedAt: '2026-01-15T18:00:00.000',
		isRsvpGoingCount: 10,
		isAttendedCount: 9,
		inviteeCount: 12,
		createdAt: '2026-01-05T11:00:00.000',
	},
	// === 진행 중인 회식 (투표 마감 전) ===
	{
		gatheringId: 1,
		title: '1월 신년회 회식',
		isOwner: true,
		rsvpStatus: true,
		isAttended: false,
		isClosed: false,
		isApproved: true,
		description: '새해를 맞아 팀원들과 함께하는 신년회입니다. 맛있는 음식과 즐거운 시간을 보내요!',
		scheduledAt: '2026-02-05T19:00:00.000',
		closedAt: '2026-02-03T18:00:00.000',
		isRsvpGoingCount: 18,
		isAttendedCount: 0,
		inviteeCount: 25,
		createdAt: '2026-01-20T10:00:00.000',
	},
	{
		gatheringId: 2,
		title: '개발팀 월간 회식',
		isOwner: false,
		rsvpStatus: true,
		isAttended: false,
		isClosed: false,
		isApproved: true,
		description: '개발팀 월간 정기 회식입니다.',
		scheduledAt: '2026-02-07T19:30:00.000',
		closedAt: '2026-02-05T12:00:00.000',
		isRsvpGoingCount: 8,
		isAttendedCount: 0,
		inviteeCount: 12,
		createdAt: '2026-01-25T14:30:00.000',
	},
	{
		gatheringId: 3,
		title: '프로젝트 완료 기념 회식',
		isOwner: true,
		rsvpStatus: false,
		isAttended: false,
		isClosed: false,
		isApproved: false,
		description: 'DPM 프로젝트 성공적인 런칭을 축하하는 자리입니다. 모두 참석 부탁드려요!',
		scheduledAt: '2026-02-14T18:30:00.000',
		closedAt: '2026-02-12T23:59:00.000',
		isRsvpGoingCount: 5,
		isAttendedCount: 0,
		inviteeCount: 15,
		createdAt: '2026-01-28T09:00:00.000',
	},
	{
		gatheringId: 4,
		title: '디자인팀 워크샵 후 회식',
		isOwner: false,
		rsvpStatus: false,
		isAttended: false,
		isClosed: false,
		isApproved: true,
		description: '워크샵 후 가볍게 저녁 먹어요.',
		scheduledAt: '2026-02-20T19:00:00.000',
		closedAt: '2026-02-18T18:00:00.000',
		isRsvpGoingCount: 6,
		isAttendedCount: 0,
		inviteeCount: 8,
		createdAt: '2026-02-01T11:00:00.000',
	},
	{
		gatheringId: 5,
		title: '신규 입사자 환영 회식',
		isOwner: false,
		rsvpStatus: false,
		isAttended: false,
		isClosed: false,
		isApproved: true,
		description: '새로 합류한 팀원들을 환영하는 자리입니다.',
		scheduledAt: '2026-02-28T19:00:00.000',
		closedAt: '2026-02-26T12:00:00.000',
		isRsvpGoingCount: 20,
		isAttendedCount: 0,
		inviteeCount: 30,
		createdAt: '2026-02-10T15:00:00.000',
	},
	{
		gatheringId: 6,
		title: '3월 정기 회식',
		isOwner: true,
		rsvpStatus: true,
		isAttended: false,
		isClosed: false,
		isApproved: true,
		description: '3월 정기 회식입니다. 이번엔 고기 먹으러 가요!',
		scheduledAt: '2026-03-07T19:00:00.000',
		closedAt: '2026-03-05T18:00:00.000',
		isRsvpGoingCount: 15,
		isAttendedCount: 0,
		inviteeCount: 25,
		createdAt: '2026-02-20T10:00:00.000',
	},
	{
		gatheringId: 7,
		title: 'QA팀 회식',
		isOwner: false,
		rsvpStatus: true,
		isAttended: false,
		isClosed: false,
		isApproved: true,
		description: 'QA팀 자체 회식입니다.',
		scheduledAt: '2026-03-14T19:30:00.000',
		closedAt: '2026-03-12T18:00:00.000',
		isRsvpGoingCount: 4,
		isAttendedCount: 0,
		inviteeCount: 6,
		createdAt: '2026-02-25T09:30:00.000',
	},
	{
		gatheringId: 8,
		title: '봄맞이 야유회 회식',
		isOwner: false,
		rsvpStatus: false,
		isAttended: false,
		isClosed: false,
		isApproved: true,
		description: '야유회 후 바베큐 파티! 가족 동반 가능합니다.',
		scheduledAt: '2026-03-21T17:00:00.000',
		closedAt: '2026-03-18T12:00:00.000',
		isRsvpGoingCount: 35,
		isAttendedCount: 0,
		inviteeCount: 50,
		createdAt: '2026-03-01T14:00:00.000',
	},
	{
		gatheringId: 9,
		title: '마케팅팀 런칭 기념 회식',
		isOwner: true,
		rsvpStatus: true,
		isAttended: false,
		isClosed: false,
		isApproved: false,
		description: '신규 캠페인 런칭 성공을 축하하는 자리입니다.',
		scheduledAt: '2026-03-28T19:00:00.000',
		closedAt: '2026-03-26T18:00:00.000',
		isRsvpGoingCount: 10,
		isAttendedCount: 0,
		inviteeCount: 12,
		createdAt: '2026-03-10T16:00:00.000',
	},
	{
		gatheringId: 10,
		title: '4월 벚꽃 회식',
		isOwner: false,
		rsvpStatus: false,
		isAttended: false,
		isClosed: false,
		isApproved: true,
		description: '벚꽃 구경하며 즐기는 봄 회식! 한강 근처 레스토랑 예정입니다.',
		scheduledAt: '2026-04-04T18:30:00.000',
		closedAt: '2026-04-01T18:00:00.000',
		isRsvpGoingCount: 22,
		isAttendedCount: 0,
		inviteeCount: 30,
		createdAt: '2026-03-15T11:00:00.000',
	},
];

export { AfterPartyList };
