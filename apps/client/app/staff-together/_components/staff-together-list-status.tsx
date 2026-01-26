'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { cn, useDragScroll } from '@dpm-core/shared';

interface ChipProps extends React.ComponentProps<'span'> {
	label: string;
	value: string;
	checked: boolean;
	onToggle?: () => void;
}

const Chip = ({ label, value, checked, onToggle, ...props }: ChipProps) => {
	const [selected, setSelected] = useState<boolean>(checked);

	const styles = {
		base: 'font-medium text-body2 inline-block flex shrink-0 h-[32px] items-center justify-center px-[12px] py-[6.5px] rounded-lg',
		unSelected: 'bg-gray-100 text-gray-800',
		selected: 'bg-gray-800 text-white',
	};

	const handleToggle = () => {
		setSelected((prev) => !prev);
		onToggle?.();
	};

	return (
		<span
			className={cn(styles.base, selected ? styles.selected : styles.unSelected)}
			{...props}
			onClick={handleToggle}
		>
			{label}
		</span>
	);
};

const STATUS_LIST = [
	{
		label: '전체',
		value: 'ALL',
	},
	{
		label: '진행 중',
		value: 'IN_PROGRESS',
	},
];

type StaffTogetherStatusType = 'ALL' | 'IN_PROGRESS';

const StaffTogetherStatusList = () => {
	const { ref, isDragging, panHandlers } = useDragScroll();
	const [selectedStatus, setSelectedStatus] = useState<StaffTogetherStatusType>('ALL');

	return (
		<motion.div
			ref={ref}
			className={cn(
				'scrollbar-hide flex space-x-[8px] overflow-x-auto overscroll-x-contain px-[16px] py-[12px]',
				isDragging ? 'cursor-grabbing select-none' : 'cursor-grab',
			)}
			{...panHandlers}
		>
			{STATUS_LIST.map((status, index) => (
				<Chip
					key={`${status.value}-${index}`}
					label={status.label}
					value={status.value}
					checked={true}
				/>
			))}
		</motion.div>
	);
};

// const SessionList = ErrorBoundary.with(
// 	{
// 		fallback: (props) => <ErrorBox onReset={() => props.reset()} />,
// 	},
// 	() => (
// 		<Suspense fallback={<LoadingBox />}>
// 			<SessionListContainer />
// 		</Suspense>
// 	),
// );

// const SessionListContainer = () => {
// 	const {
// 		data: { data: sessionResponse },
// 	} = useSuspenseQuery(getSessionListQuery);
// 	return (
// 		<Virtuoso
// 			data={sessionResponse.sessions}
// 			itemContent={(_, session) => <SessionItem key={session.id} session={session} />}
// 			className="flex-1"
// 		/>
// 	);
// };
export { StaffTogetherStatusList };
