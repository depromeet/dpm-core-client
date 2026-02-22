'use client';

import type { AttendanceStatus } from '../_types/staff-dinner';

interface AttendanceSelectorProps {
	value: AttendanceStatus;
	onChange: (status: AttendanceStatus) => void;
	name: string;
	columns?: 2 | 4;
}

export const AttendanceSelector = ({
	value,
	onChange,
	name,
	columns = 2,
}: AttendanceSelectorProps) => {
	return (
		<div
			className={`grid overflow-hidden rounded-lg border border-line-normal ${
				columns === 4 ? 'grid-cols-4' : 'grid-cols-2'
			}`}
			role="radiogroup"
			aria-label="회식 참여 여부 선택"
		>
			<label className="cursor-pointer bg-background-normal px-3 py-3.5 text-center font-medium text-body2 text-label-assistive transition-colors duration-200 has-checked:bg-primary-extralight has-checked:font-semibold has-checked:text-primary-normal">
				<input
					type="radio"
					name={name}
					value="not-attending"
					checked={value === 'not-attending'}
					onChange={() => onChange('not-attending')}
					className="sr-only"
				/>
				불참
			</label>
			<label className="cursor-pointer border-line-normal border-l bg-background-normal px-3 py-3.5 text-center font-medium text-body2 text-label-assistive transition-colors duration-200 has-checked:bg-primary-extralight has-checked:font-semibold has-checked:text-primary-normal">
				<input
					type="radio"
					name={name}
					value="attending"
					checked={value === 'attending'}
					onChange={() => onChange('attending')}
					className="sr-only"
				/>
				참석
			</label>
		</div>
	);
};
