'use client';

import type { Part } from '@dpm-core/api';
import { cn } from '@dpm-core/shared';

/** 디자인 표기에 맞춘 직군 옵션 (순서: Android · IOS · Web · Server · Design) */
const PART_OPTIONS: { value: Part; label: string }[] = [
	{ value: 'ANDROID', label: 'Android' },
	{ value: 'IOS', label: 'IOS' },
	{ value: 'WEB', label: 'Web' },
	{ value: 'SERVER', label: 'Server' },
	{ value: 'DESIGN', label: 'Design' },
];

interface PartSelectorProps {
	value: Part | null;
	onChange: (part: Part) => void;
	name: string;
}

export const PartSelector = ({ value, onChange, name }: PartSelectorProps) => {
	return (
		<div className="flex flex-col gap-2" role="radiogroup" aria-label="파트 선택">
			{PART_OPTIONS.map(({ value: partValue, label }) => {
				const isSelected = value === partValue;

				return (
					<label key={partValue} className="flex cursor-pointer items-center gap-3">
						<input
							type="radio"
							name={name}
							value={partValue}
							checked={isSelected}
							onChange={() => onChange(partValue)}
							className="sr-only"
						/>
						<span
							className={cn(
								'flex size-4 shrink-0 items-center justify-center rounded-full transition-colors',
								isSelected ? 'bg-primary-normal' : 'border border-line-normal bg-background-normal',
							)}
						>
							{isSelected && <span className="size-1.5 rounded-full bg-background-normal" />}
						</span>
						<span className="font-medium text-body2 text-label-normal">{label}</span>
					</label>
				);
			})}
		</div>
	);
};
