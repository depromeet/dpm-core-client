'use client';

import { useState } from 'react';
import {
	Button,
	Checkbox,
	ChevronDown,
	cn,
	FilterPopover,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@dpm-core/shared';

import { PART_LABEL_MAP } from '@/lib/member/part';

const PART_OPTIONS = [
	...Object.entries(PART_LABEL_MAP).map(([value, label]) => ({ value, label })),
	{ value: 'ETC', label: '미배정' },
];
const TEAM_OPTIONS = [
	{ value: '0', label: '미배정' },
	...['1', '2', '3', '4', '5', '6'].map((value) => ({ value, label: `${value}팀` })),
];

export interface MemberFilterValues {
	unapprovedOnly: boolean;
	parts: string[];
	teams: string[];
}

interface MemberFilterProps {
	values: MemberFilterValues;
	onChange: (values: MemberFilterValues) => void;
}

export const MemberFilter = ({ values, onChange }: MemberFilterProps) => {
	const [filterOpen, setFilterOpen] = useState(false);
	const [tempParts, setTempParts] = useState<string[]>(values.parts);
	const [tempTeams, setTempTeams] = useState<string[]>(values.teams);

	const hasPartFilter = values.parts.length > 0;
	const hasTeamFilter = values.teams.length > 0;

	const getPartLabel = (value: string) =>
		value === 'ETC' ? '미배정' : (PART_LABEL_MAP[value as keyof typeof PART_LABEL_MAP] ?? value);

	const getTeamLabel = (value: string) => (value === '0' ? '미배정' : `${value}팀`);

	const partFilterLabel =
		values.parts.length === 0
			? '파트별'
			: values.parts.length === 1
				? getPartLabel(values.parts[0])
				: `${getPartLabel(values.parts[0])} 외 ${values.parts.length - 1}`;

	const teamFilterLabel =
		values.teams.length === 0
			? '팀별'
			: values.teams.length === 1
				? getTeamLabel(values.teams[0])
				: `${getTeamLabel(values.teams[0])} 외 ${values.teams.length - 1}`;

	const handleFilterOpen = (open: boolean) => {
		if (open) {
			setTempParts(values.parts);
			setTempTeams(values.teams);
		}
		setFilterOpen(open);
	};

	const handleFilterChange = (section: 'parts' | 'teams', value: string) => {
		if (section === 'parts') {
			setTempParts((prev) =>
				prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value],
			);
		} else {
			setTempTeams((prev) =>
				prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
			);
		}
	};

	const handleFilterReset = () => {
		setTempParts([]);
		setTempTeams([]);
	};

	const handleFilterApply = () => {
		onChange({
			...values,
			parts: tempParts,
			teams: tempTeams,
		});
		setFilterOpen(false);
	};

	return (
		<div className="flex items-center gap-2">
			<div
				className={cn(
					'flex cursor-pointer items-center gap-1.5 rounded-lg border px-4 py-2.5',
					values.unapprovedOnly
						? 'border-primary-normal'
						: 'border-line-subtle bg-background-normal',
				)}
				onClick={() => onChange({ ...values, unapprovedOnly: !values.unapprovedOnly })}
			>
				<Checkbox
					id="unapproved-only"
					checked={values.unapprovedOnly}
					onCheckedChange={(checked) => onChange({ ...values, unapprovedOnly: checked === true })}
					className="size-4 cursor-pointer rounded-sm border-line-normal text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
				/>
				<Label
					htmlFor="unapproved-only"
					className="cursor-pointer font-normal text-body2 text-label-assistive"
				>
					미승인만 보기
				</Label>
			</div>

			<Popover open={filterOpen} onOpenChange={handleFilterOpen}>
				<div className="flex gap-2">
					<PopoverTrigger asChild>
						<Button
							size="none"
							className={cn(
								'h-10 gap-1 rounded-lg border px-4 py-2.5 font-normal text-body2 hover:bg-inherit',
								hasPartFilter || hasTeamFilter
									? 'border-primary-normal text-primary-normal'
									: 'border-line-subtle bg-background-normal text-label-assistive',
							)}
						>
							{partFilterLabel}
							<ChevronDown className="size-3" />
						</Button>
					</PopoverTrigger>
					<PopoverTrigger asChild>
						<Button
							size="none"
							className={cn(
								'h-10 gap-1 rounded-lg border px-4 py-2.5 font-normal text-body2 hover:bg-inherit',
								hasTeamFilter
									? 'border-primary-normal text-primary-normal'
									: 'border-line-subtle bg-background-normal text-label-assistive',
							)}
						>
							{teamFilterLabel}
							<ChevronDown className="size-3" />
						</Button>
					</PopoverTrigger>
				</div>
				<PopoverContent align="end" className="w-auto border-none p-0 shadow-none">
					<FilterPopover
						title="필터"
						sections={[
							{ label: '파트별', options: PART_OPTIONS },
							{ label: '팀별', options: TEAM_OPTIONS },
						]}
						selectedValues={{
							파트별: tempParts,
							팀별: tempTeams,
						}}
						onFilterChange={(label, value) =>
							handleFilterChange(label === '파트별' ? 'parts' : 'teams', value)
						}
						onClose={() => setFilterOpen(false)}
						onReset={handleFilterReset}
						onApply={handleFilterApply}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};
