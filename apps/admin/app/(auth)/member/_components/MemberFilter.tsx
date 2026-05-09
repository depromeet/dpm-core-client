'use client';

import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import {
	Button,
	Checkbox,
	ChevronDown,
	cn,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	FilterChip,
	FilterPopover,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@dpm-core/shared';

import { PART_LABEL_MAP } from '@/lib/member/part';

function isPartKey(value: string): value is keyof typeof PART_LABEL_MAP {
	return value in PART_LABEL_MAP;
}

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
	latest: boolean;
	parts: string[];
	teams: string[];
}

interface MemberFilterProps {
	values: MemberFilterValues;
	onChange: (values: MemberFilterValues) => void;
}

export const MemberFilter = ({ values, onChange }: MemberFilterProps) => {
	const [partFilterOpen, setPartFilterOpen] = useState(false);
	const [teamFilterOpen, setTeamFilterOpen] = useState(false);
	const [tempParts, setTempParts] = useState<string[]>(values.parts);
	const [tempTeams, setTempTeams] = useState<string[]>(values.teams);

	const hasPartFilter = values.parts.length > 0;
	const hasTeamFilter = values.teams.length > 0;

	const getPartLabel = (value: string) => {
		if (value === 'ETC') return '미배정';
		if (isPartKey(value)) return PART_LABEL_MAP[value];
		return value;
	};

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

	const handlePartFilterOpen = (open: boolean) => {
		if (open) setTempParts(values.parts);
		setPartFilterOpen(open);
	};

	const handleTeamFilterOpen = (open: boolean) => {
		if (open) setTempTeams(values.teams);
		setTeamFilterOpen(open);
	};

	const handlePartFilterChange = (_section: string, value: string) => {
		setTempParts((prev) =>
			prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value],
		);
	};

	const handleTeamFilterChange = (_section: string, value: string) => {
		setTempTeams((prev) =>
			prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
		);
	};

	const handlePartFilterApply = () => {
		onChange({ ...values, parts: tempParts });
		setPartFilterOpen(false);
	};

	const handleTeamFilterApply = () => {
		onChange({ ...values, teams: tempTeams });
		setTeamFilterOpen(false);
	};

	return (
		<>
			{/* Mobile view (< 768px) */}

			<div className="mt-2 flex w-full items-center justify-between py-2.5 md:hidden">
				<Drawer>
					<div className="flex gap-2">
						<DrawerTrigger asChild>
							<Button
								size="none"
								className={cn(
									'gap-1 rounded-lg border border-line-normal bg-background-normal px-2.5 py-1 font-normal text-body2 text-label-assistive hover:bg-inherit',
									partFilterLabel !== '파트별' && 'border-primary-normal text-primary-normal',
								)}
							>
								{partFilterLabel}
								<ChevronDown />
							</Button>
						</DrawerTrigger>
						<DrawerTrigger asChild>
							<Button
								size="none"
								className={cn(
									'gap-1 rounded-lg border border-line-normal bg-background-normal px-2.5 py-1 font-normal text-body2 text-label-assistive hover:bg-inherit',
									teamFilterLabel !== '팀별' && 'border-primary-normal text-primary-normal',
								)}
							>
								{teamFilterLabel}
								<ChevronDown />
							</Button>
						</DrawerTrigger>
					</div>
					<DrawerContent className="w-full">
						<DrawerHeader>
							<DrawerTitle>필터</DrawerTitle>
						</DrawerHeader>
						<div className="mt-8 px-6">
							<p className="mb-2 font-semibold text-body1 text-label-normal">파트별</p>
							<div className="flex flex-wrap gap-2">
								{PART_OPTIONS.map((chip) => {
									const checked = tempParts.includes(chip.value);
									return (
										<FilterChip
											key={chip.label}
											id={chip.label}
											checked={checked}
											onClick={() =>
												setTempParts((prev) =>
													prev.includes(chip.value)
														? prev.filter((t) => t !== chip.value)
														: [...prev, chip.value],
												)
											}
										>
											{chip.label}
										</FilterChip>
									);
								})}
							</div>
						</div>
						<div className="mt-7.5 mb-40 px-6">
							<p className="mb-2 font-semibold text-body1 text-label-normal">팀별</p>
							<div className="flex flex-wrap gap-2">
								{TEAM_OPTIONS.map((chip) => {
									const checked = tempTeams.includes(chip.value);
									return (
										<FilterChip
											key={chip.label}
											id={chip.label}
											checked={checked}
											onClick={() =>
												setTempTeams((prev) =>
													prev.includes(chip.value)
														? prev.filter((t) => t !== chip.value)
														: [...prev, chip.value],
												)
											}
										>
											{chip.label}
										</FilterChip>
									);
								})}
							</div>
						</div>
						<DrawerFooter className="flex flex-row gap-2 px-4 py-3">
							<DrawerClose asChild>
								<Button
									variant="none"
									size="none"
									className="flex items-center rounded-lg bg-background-strong p-3.5"
									onClick={() => {
										setTempParts([]);
										setTempTeams([]);
										onChange({ ...values, teams: [], parts: [] });
									}}
								>
									<RotateCw className="size-5 text-gray-400" />
								</Button>
							</DrawerClose>
							<DrawerClose asChild>
								<Button
									className="flex-1 rounded-lg"
									size="lg"
									variant="secondary"
									onClick={() => {
										onChange({ ...values, teams: tempTeams, parts: tempParts });
									}}
								>
									적용하기
								</Button>
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
				<div className="flex flex-wrap justify-end gap-3">
					<div className="flex items-center gap-1.5">
						<Checkbox
							id="unapproved-only"
							checked={values.unapprovedOnly}
							onClick={() => onChange({ ...values, unapprovedOnly: !values.unapprovedOnly })}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									onChange({ ...values, unapprovedOnly: !values.unapprovedOnly });
								}
							}}
							className="size-4 cursor-pointer rounded-sm border-line-normal text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
						/>
						<Label
							htmlFor="unapproved-only"
							className="cursor-pointer font-normal text-body2 text-label-assistive"
						>
							미승인만 보기
						</Label>
					</div>
					<div className="flex items-center gap-1.5">
						<Checkbox
							id="lastest"
							checked={values.latest}
							onClick={() => onChange({ ...values, latest: !values.latest })}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									onChange({ ...values, latest: !values.latest });
								}
							}}
							className="size-4 cursor-pointer rounded-sm border-line-normal text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
						/>
						<Label
							htmlFor="lastest"
							className="cursor-pointer font-normal text-body2 text-label-assistive"
						>
							이번 기수만 보기
						</Label>
					</div>
				</div>
			</div>

			{/* Desktop view (>= 768px) */}
			<div className="hidden flex-wrap items-center justify-end gap-2 md:flex">
				<div className="flex flex-wrap justify-end gap-2">
					{/* biome-ignore lint/a11y/useSemanticElements: Checkbox가 버튼 컴포넌트이므로 nested button 이슈를 해결하기 위해 div role button 사용 */}
					<div
						role="button"
						tabIndex={0}
						className={cn(
							'flex cursor-pointer items-center gap-1.5 rounded-lg border px-4 py-2.5',
							values.unapprovedOnly
								? 'border-primary-normal'
								: 'border-line-subtle bg-background-normal',
						)}
						onClick={() => onChange({ ...values, unapprovedOnly: !values.unapprovedOnly })}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onChange({ ...values, unapprovedOnly: !values.unapprovedOnly });
							}
						}}
						aria-pressed={values.unapprovedOnly}
						aria-label="미승인만 보기"
					>
						<Checkbox
							checked={values.unapprovedOnly}
							className="pointer-events-none size-4 shrink-0 rounded-sm border-line-normal text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
						/>
						<Label className="cursor-pointer font-normal text-body2 text-label-assistive">
							미승인만 보기
						</Label>
					</div>

					{/* biome-ignore lint/a11y/useSemanticElements: Checkbox가 버튼 컴포넌트이므로 nested button 이슈를 해결하기 위해 div role button 사용 */}
					<div
						role="button"
						tabIndex={0}
						className={cn(
							'flex cursor-pointer items-center gap-1.5 rounded-lg border px-4 py-2.5',
							values.latest ? 'border-primary-normal' : 'border-line-subtle bg-background-normal',
						)}
						onClick={() => onChange({ ...values, latest: !values.latest })}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onChange({ ...values, latest: !values.latest });
							}
						}}
						aria-pressed={values.latest}
						aria-label="이번 기수만 보기"
					>
						<Checkbox
							checked={values.latest}
							className="pointer-events-none size-4 shrink-0 rounded-sm border-line-normal text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
						/>
						<Label className="cursor-pointer font-normal text-body2 text-label-assistive">
							이번 기수만 보기
						</Label>
					</div>
				</div>
				<div className="flex gap-2">
					<Popover open={partFilterOpen} onOpenChange={handlePartFilterOpen}>
						<PopoverTrigger asChild>
							<Button
								size="none"
								variant="none"
								className={cn(
									'h-10 gap-1 rounded-lg border px-4 py-2.5 font-normal text-body2 transition-colors hover:bg-background-strong',
									hasPartFilter
										? 'border-primary-normal text-primary-normal'
										: 'border-line-subtle bg-background-normal text-label-assistive',
								)}
							>
								{partFilterLabel}
								<ChevronDown className="size-3" />
							</Button>
						</PopoverTrigger>
						<PopoverContent align="end" className="w-auto border-none p-0 shadow-none">
							<FilterPopover
								title="파트별"
								sections={[{ label: '파트별', options: PART_OPTIONS }]}
								selectedValues={{ 파트별: tempParts }}
								onFilterChange={handlePartFilterChange}
								onClose={() => setPartFilterOpen(false)}
								onReset={() => setTempParts([])}
								onApply={handlePartFilterApply}
							/>
						</PopoverContent>
					</Popover>

					<Popover open={teamFilterOpen} onOpenChange={handleTeamFilterOpen}>
						<PopoverTrigger asChild>
							<Button
								size="none"
								variant="none"
								className={cn(
									'h-10 gap-1 rounded-lg border px-4 py-2.5 font-normal text-body2 transition-colors hover:bg-background-strong',
									hasTeamFilter
										? 'border-primary-normal text-primary-normal'
										: 'border-line-subtle bg-background-normal text-label-assistive',
								)}
							>
								{teamFilterLabel}
								<ChevronDown className="size-3" />
							</Button>
						</PopoverTrigger>
						<PopoverContent align="end" className="w-auto border-none p-0 shadow-none">
							<FilterPopover
								title="팀별"
								sections={[{ label: '팀별', options: TEAM_OPTIONS }]}
								selectedValues={{ 팀별: tempTeams }}
								onFilterChange={handleTeamFilterChange}
								onClose={() => setTeamFilterOpen(false)}
								onReset={() => setTempTeams([])}
								onApply={handleTeamFilterApply}
							/>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</>
		//
	);
};
