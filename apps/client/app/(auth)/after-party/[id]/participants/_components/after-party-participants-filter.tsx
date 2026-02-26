'use client';

import { Checkbox, cn, Label, ToggleGroup, ToggleGroupItem } from '@dpm-core/shared';

import { useAuth } from '@/providers/auth-provider';

import { useAfterPartyParticipantsFilterSearchParams } from '../_hooks/use-after-party-participants-filter-search-params';

export const AfterPartyParticipantsFilter = () => {
	const {
		afterPartyParticipantsStatus,
		afterPartyParticipantsIsMyTeam,
		handleChangeSAfterPartyParticipantsStatus,
		handleChangeAfterPartyParticipantsIsMyTeam,
	} = useAfterPartyParticipantsFilterSearchParams();

	const { user } = useAuth();

	return (
		<div className="flex items-center justify-between">
			<ToggleGroup
				size="sm"
				type="single"
				className="gap-2 border-none"
				value={afterPartyParticipantsStatus}
				onValueChange={handleChangeSAfterPartyParticipantsStatus}
			>
				<ToggleGroupItem
					className={cn(
						'flex h-7 cursor-pointer items-center rounded-lg border px-3 py-1 font-medium text-body2',
						'border-gray-200',
						'transition duration-150 ease-out',
						'data-[state=on]:border-transparent data-[state=on]:bg-gray-900 data-[state=on]:text-white',
						'data-[state=off]:bg-white data-[state=off]:text-label-assistive',
					)}
					value="NO"
				>
					미제출
				</ToggleGroupItem>
				<ToggleGroupItem
					className={cn(
						'flex h-7 cursor-pointer items-center rounded-lg border px-3 py-1 font-medium text-body2',
						'border-gray-200',
						'transition duration-150 ease-out',
						'data-[state=on]:border-transparent data-[state=on]:bg-gray-900 data-[state=on]:text-white',
						'data-[state=off]:bg-white data-[state=off]:text-label-assistive',
					)}
					value="YES"
				>
					제출
				</ToggleGroupItem>
			</ToggleGroup>
			{user?.teamNumber && (
				<div className="flex items-center gap-1.5">
					<Checkbox
						id="isMyTeam"
						className="size-4 cursor-pointer rounded-sm border-line-normal text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
						checked={afterPartyParticipantsIsMyTeam}
						onCheckedChange={handleChangeAfterPartyParticipantsIsMyTeam}
					/>
					<Label
						htmlFor="isMyTeam"
						className="cursor-pointer font-normal text-body2 text-label-assistive"
					>
						내 팀만 보기
					</Label>
				</div>
			)}
		</div>
	);
};
