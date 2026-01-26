'use client';

import { cn } from '@dpm-core/shared';

interface StaffTogetherItemProps {
	/** 고유 ID */
	id: number;
	/** 회식 라벨 */
	labels: StaffTogetherItemLabelProps[];
	/** 회식 제목 */
	title: string;
	/** 회식 설명 */
	description?: string;
	/** 회식 초대 범위 (예: 전체, 특정 파트 등) */
	inviteScope: string;
	/** 회식 시간 (Unix timestamp, ms) */
	eventDate: number;
	/** 참여조사 마감시간 (Unix timestamp, ms) */
	surveyDeadline: number;
	/** 참여 조사 마감 후 수정 허용 여부 */
	allowEditAfterDeadline: boolean;
}

type StaffTogetherLabelType = 'createdByMe' | 'daysUntilDeadline';

interface StaffTogetherItemLabelProps {
	/** 라벨 타입 */
	type: StaffTogetherLabelType;
	/** N일 뒤 마감일 때 남은 일수 */
	daysLeft?: number;
}

const StaffTogetherItemLabel = ({ type, daysLeft }: StaffTogetherItemLabelProps) => {
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

const StaffTogetherItem = ({
	labels,
	title,
	description = '',
	...props
}: StaffTogetherItemProps) => {
	const styles = {
		base: 'bg-gray-0 p-[16px] font-semibold text-caption1 h-[149px] border-b border-b-line-subtle space-y-[8px]',
		yellow: 'bg-[#FFFCF7]',
		gray: 'bg-gray-50',
	};

	return (
		<div className={cn(styles.base)}>
			<div className="space-x-[4px]">
				{labels.map((label) => (
					<StaffTogetherItemLabel key={label.type} type={label.type} daysLeft={label.daysLeft} />
				))}
			</div>
			<p className="font-semibold text-body1 text-gray-800">{title}</p>
			<p className="text-ellipsis font-medium text-body2 text-gray-600">{description}</p>
			<div></div>
		</div>
	);
};

const StaffTogetherList = () => {
	return (
		<div>
			{STAFF_TOGETHER_LIST.map((item) => (
				<StaffTogetherItem key={item.id} {...item} />
			))}
		</div>
	);
};

const STAFF_TOGETHER_LIST: StaffTogetherItemProps[] = [
	{
		id: 1,
		labels: [{ type: 'createdByMe' }, { type: 'daysUntilDeadline', daysLeft: 2 }],
		title: '1월 신년회 회식',
		description: '새해를 맞아 팀원들과 함께하는 신년회입니다. 맛있는 음식과 즐거운 시간을 보내요!',
		inviteScope: '전체',
		eventDate: 1769850000000, // 2026-01-31 19:00
		surveyDeadline: 1769590800000, // 2026-01-28 18:00
		allowEditAfterDeadline: false,
	},
	{
		id: 2,
		labels: [{ type: 'daysUntilDeadline', daysLeft: 10 }],
		title: '개발팀 월간 회식',
		description: '개발팀 월간 정기 회식입니다.',
		inviteScope: '개발팀',
		eventDate: 1770456600000, // 2026-02-07 19:30
		surveyDeadline: 1770282000000, // 2026-02-05 12:00
		allowEditAfterDeadline: true,
	},
	{
		id: 3,
		labels: [{ type: 'createdByMe' }],
		title: '프로젝트 완료 기념 회식',
		description: 'DPM 프로젝트 성공적인 런칭을 축하하는 자리입니다. 모두 참석 부탁드려요!',
		inviteScope: '프로젝트 참여자',
		eventDate: 1771059000000, // 2026-02-14 18:30
		surveyDeadline: 1770926340000, // 2026-02-12 23:59
		allowEditAfterDeadline: false,
	},
	{
		id: 4,
		labels: [{ type: 'daysUntilDeadline', daysLeft: 5 }],
		title: '디자인팀 워크샵 후 회식',
		description: '워크샵 후 가볍게 저녁 먹어요.',
		inviteScope: '디자인팀',
		eventDate: 1771578000000, // 2026-02-20 19:00
		surveyDeadline: 1771405200000, // 2026-02-18 18:00
		allowEditAfterDeadline: true,
	},
	{
		id: 5,
		labels: [],
		title: '신규 입사자 환영 회식',
		description: '새로 합류한 팀원들을 환영하는 자리입니다.',
		inviteScope: '전체',
		eventDate: 1772269200000, // 2026-02-28 19:00
		surveyDeadline: 1772096400000, // 2026-02-26 12:00
		allowEditAfterDeadline: false,
	},
	{
		id: 6,
		labels: [{ type: 'createdByMe' }, { type: 'daysUntilDeadline', daysLeft: 7 }],
		title: '3월 정기 회식',
		description: '3월 정기 회식입니다. 이번엔 고기 먹으러 가요!',
		inviteScope: '전체',
		eventDate: 1772874000000, // 2026-03-07 19:00
		surveyDeadline: 1772701200000, // 2026-03-05 18:00
		allowEditAfterDeadline: true,
	},
	{
		id: 7,
		labels: [{ type: 'daysUntilDeadline', daysLeft: 14 }],
		title: 'QA팀 회식',
		description: 'QA팀 자체 회식입니다.',
		inviteScope: 'QA팀',
		eventDate: 1773480600000, // 2026-03-14 19:30
		surveyDeadline: 1773306000000, // 2026-03-12 18:00
		allowEditAfterDeadline: false,
	},
	{
		id: 8,
		labels: [{ type: 'daysUntilDeadline', daysLeft: 21 }],
		title: '봄맞이 야유회 회식',
		description: '야유회 후 바베큐 파티! 가족 동반 가능합니다.',
		inviteScope: '전체 (가족 동반 가능)',
		eventDate: 1774083600000, // 2026-03-21 17:00
		surveyDeadline: 1773828000000, // 2026-03-18 12:00
		allowEditAfterDeadline: false,
	},
	{
		id: 9,
		labels: [{ type: 'createdByMe' }],
		title: '마케팅팀 런칭 기념 회식',
		description: '신규 캠페인 런칭 성공을 축하하는 자리입니다.',
		inviteScope: '마케팅팀',
		eventDate: 1774692000000, // 2026-03-28 19:00
		surveyDeadline: 1774519200000, // 2026-03-26 18:00
		allowEditAfterDeadline: true,
	},
	{
		id: 10,
		labels: [{ type: 'daysUntilDeadline', daysLeft: 30 }],
		title: '4월 벚꽃 회식',
		description: '벚꽃 구경하며 즐기는 봄 회식! 한강 근처 레스토랑 예정입니다.',
		inviteScope: '전체',
		eventDate: 1775294400000, // 2026-04-04 18:30
		surveyDeadline: 1775124000000, // 2026-04-01 18:00
		allowEditAfterDeadline: false,
	},
];

export { StaffTogetherList };
