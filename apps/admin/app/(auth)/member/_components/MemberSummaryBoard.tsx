'use client';

import { ChevronRight } from 'lucide-react';
import type { MemberBadgeCard, MemberManagementTotals } from '@dpm-core/api';
import { cn } from '@dpm-core/shared';

interface SummaryStatProps {
	label: string;
	value: number;
	className?: string;
}

/** 라벨과 숫자 한 쌍. 도메인은 모르고 넘겨받은 값만 그린다. */
const SummaryStat = ({ label, value, className }: SummaryStatProps) => (
	<div className={cn('flex min-w-15 flex-col gap-1', className)}>
		<span className="font-medium text-body2 text-label-assistive">{label}</span>
		<span className="font-bold text-headline1 text-label-normal">{value}</span>
	</div>
);

interface SummaryActionCardProps extends SummaryStatProps {
	hasNew?: boolean;
	onClick: () => void;
}

/** 눌러서 해당 조건만 걸러볼 수 있는 요약 카드. */
const SummaryActionCard = ({ label, value, hasNew, onClick }: SummaryActionCardProps) => (
	<button
		type="button"
		onClick={onClick}
		className="flex flex-1 cursor-pointer flex-col items-start gap-1 rounded-xl bg-background-strong px-5 py-5 text-left transition-colors hover:bg-background-heavy"
	>
		<span className="flex items-center gap-0.5 font-medium text-body2 text-primary-normal">
			{label}
			<ChevronRight className="size-4" />
			{hasNew && (
				<>
					<span className="ml-0.5 size-1.5 rounded-full bg-red-500" aria-hidden />
					<span className="sr-only">새로운 변경 있음</span>
				</>
			)}
		</span>
		<span className="font-bold text-headline1 text-label-normal">{value}</span>
	</button>
);

interface MemberSummaryBoardProps {
	cohortNumber?: string;
	summary: MemberManagementTotals;
	newBadgeCards: Set<MemberBadgeCard>;
	onSelectCard: (card: MemberBadgeCard) => void;
}

/** 요약 대시보드. 현황 숫자와, 눌러서 걸러볼 수 있는 세 가지 카드를 함께 보여준다. */
export const MemberSummaryBoard = ({
	cohortNumber,
	summary,
	newBadgeCards,
	onSelectCard,
}: MemberSummaryBoardProps) => {
	return (
		<div className="flex w-full items-stretch gap-3.5">
			<div className="flex flex-1 items-center gap-12 rounded-xl bg-background-strong px-9 py-5">
				<SummaryStat
					label={cohortNumber ? `${cohortNumber}기 멤버` : '전체 멤버'}
					value={summary.totalMemberCount}
				/>
				<div className="h-full w-px bg-line-normal" />
				<SummaryStat label="디퍼" value={summary.deeperCount} />
				<SummaryStat label="운영진" value={summary.organizerCount} />
				<SummaryStat label="코어" value={summary.coreCount} />
			</div>

			<SummaryActionCard
				label="미승인"
				value={summary.pendingCount}
				hasNew={newBadgeCards.has('PENDING')}
				onClick={() => onSelectCard('PENDING')}
			/>
			<SummaryActionCard
				label="정보 미입력"
				value={summary.missingInformationCount}
				hasNew={newBadgeCards.has('INCOMPLETE')}
				onClick={() => onSelectCard('INCOMPLETE')}
			/>
			<SummaryActionCard
				label="수료 위험"
				value={summary.graduationRiskCount}
				hasNew={newBadgeCards.has('AT_RISK')}
				onClick={() => onSelectCard('AT_RISK')}
			/>
		</div>
	);
};
