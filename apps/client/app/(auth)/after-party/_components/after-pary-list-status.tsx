'use client';

import { cn, DragScrollContainer } from '@dpm-core/shared';

type AfterPartyStatusType = 'ALL' | 'IN_PROGRESS';

interface ChipProps extends React.ComponentProps<'span'> {
	label: string;
	value: AfterPartyStatusType;
	selected: boolean;
	onSelect: () => void;
}

const Chip = ({ label, value, selected, onSelect, ...props }: ChipProps) => {
	const styles = {
		base: 'font-medium text-body2 inline-block flex shrink-0 h-[32px] items-center justify-center px-[12px] py-[6.5px] rounded-lg cursor-pointer',
		unSelected: 'bg-gray-100 text-gray-800',
		selected: 'bg-gray-800 text-white',
	};

	return (
		<span
			className={cn(styles.base, selected ? styles.selected : styles.unSelected)}
			onClick={onSelect}
			{...props}
		>
			{label}
		</span>
	);
};

const STATUS_LIST: { label: string; value: AfterPartyStatusType }[] = [
	{
		label: '전체',
		value: 'ALL',
	},
	{
		label: '진행 중',
		value: 'IN_PROGRESS',
	},
];

interface AfterPartyStatusListProps {
	selectedStatus: AfterPartyStatusType;
	onStatusChange: (status: AfterPartyStatusType) => void;
}

const AfterPartyStatusList = ({ selectedStatus, onStatusChange }: AfterPartyStatusListProps) => {
	return (
		<DragScrollContainer className="space-x-[8px] px-[16px] py-[12px]">
			{STATUS_LIST.map((status) => (
				<Chip
					key={status.value}
					label={status.label}
					value={status.value}
					selected={selectedStatus === status.value}
					onSelect={() => onStatusChange(status.value)}
				/>
			))}
		</DragScrollContainer>
	);
};

export { AfterPartyStatusList, type AfterPartyStatusType };
