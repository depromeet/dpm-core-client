'use client';

import type { AttendanceStatus } from '../_types/after-party-survey';

interface AttendanceSelectorProps {
	value: AttendanceStatus;
	onChange: (status: AttendanceStatus) => void;
	name: string;
}

export const AttendanceSelector = ({ value, onChange, name }: AttendanceSelectorProps) => {
	return (
		<div
			className={`flex justify-between overflow-hidden rounded-lg border border-line-normal`}
			role="radiogroup"
			aria-label="회식 참여 여부 선택"
		>
			<label className="flex-1 cursor-pointer bg-background-normal px-3 py-3.5 text-center font-medium text-body2 text-label-assistive transition-colors duration-200 has-checked:bg-primary-extralight has-checked:font-semibold has-checked:text-primary-normal">
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
			<label className="flex-1 cursor-pointer border-line-normal border-l bg-background-normal px-3 py-3.5 text-center font-medium text-body2 text-label-assistive transition-colors duration-200 has-checked:bg-primary-extralight has-checked:font-semibold has-checked:text-primary-normal">
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
