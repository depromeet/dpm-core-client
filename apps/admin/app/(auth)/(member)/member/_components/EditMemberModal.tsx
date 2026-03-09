'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	ToggleGroup,
	ToggleGroupItem,
} from '@dpm-core/shared';
import { XIcon } from 'lucide-react';

import EtcIcon from '@/assets/icons/etc.webp';
import { cohort } from '@/constants/cohort';
import { PART_LABEL_MAP } from '@/lib/member/part';
import { isExistPart } from '@/lib/utils';

import type { MemberListItem } from '../_types';
import type { Part } from '@dpm-core/api';

/** 파트별 이미지 반환 - ETC(미배정)는 etc.webp */
function getPartImage(part: Part) {
	if (part === 'ETC') return EtcIcon;
	return isExistPart(part) ? cohort[part] : null;
}

const PART_OPTIONS: { value: Part; label: string }[] = [
	{ value: 'ETC', label: '미배정' },
	{ value: 'DESIGN', label: PART_LABEL_MAP.DESIGN },
	{ value: 'WEB', label: PART_LABEL_MAP.WEB },
	{ value: 'SERVER', label: PART_LABEL_MAP.SERVER },
	{ value: 'IOS', label: 'IOS' },
	{ value: 'ANDROID', label: 'ANDROID' },
];

const TEAM_OPTIONS = [
	{ value: '0', label: '미배정' },
	...['1', '2', '3', '4', '5', '6'].map((value) => ({ value, label: `${value}팀` })),
];

const TOGGLE_ITEM_CLASS =
	'flex h-full min-w-0 flex-1 items-center justify-center rounded-none border-0 border-l border-[#D1D5DB] bg-white px-3 py-2.5 text-[14px] font-medium leading-[142%] text-[#9CA3AF] first:border-l-0 data-[state=on]:bg-[#EFF3FF] data-[state=on]:font-semibold data-[state=on]:text-[#5E83FE]';

interface EditMemberModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	members: MemberListItem[];
	onSubmit: (part: Part, teamNumber: number) => void;
}

export const EditMemberModal = ({
	open,
	onOpenChange,
	members,
	onSubmit,
}: EditMemberModalProps) => {
	const [selectedPart, setSelectedPart] = useState<Part>('ETC');
	const [selectedTeam, setSelectedTeam] = useState<string>('0');

	const handleSubmit = () => {
		onSubmit(selectedPart, Number(selectedTeam));
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="flex w-[640px] max-w-[640px] flex-col items-start gap-0 rounded-2xl bg-white p-0 shadow-[0px_18px_33px_rgba(0,0,0,0.02),0px_8px_40px_rgba(0,0,0,0.1),0px_0px_6px_rgba(0,0,0,0.1)] sm:max-w-[640px]"
				showCloseButton={false}
			>
				{/* Header - padding 32px 32px 16px, gap 12px, height 112px */}
				<DialogHeader className="flex h-[112px] w-full flex-row items-start justify-end gap-3 self-stretch px-8 pt-8 pb-4">
					<div className="flex flex-1 flex-col items-start gap-3">
						<DialogTitle className="font-bold text-[22px] leading-[136%] tracking-[-0.02em] text-[#1F2937]">
							멤버 수정하기
						</DialogTitle>
						<DialogDescription className="font-medium text-[14px] leading-[22px] text-[#81898F]">
							멤버의 정보가 변동되거나 잘못 기입된 경우에 수정해주세요
						</DialogDescription>
					</div>
					<DialogClose
						className="absolute right-8 top-8 flex size-7 items-center justify-center rounded-full bg-[#F3F4F6] p-1.5"
						aria-label="닫기"
					>
						<XIcon className="size-4 text-[#6B7280]" />
					</DialogClose>
				</DialogHeader>

				{/* Selected Members - padding 12px 32px, gap 24px, height 64px, profile gap 16px */}
				<div className="flex min-h-16 w-full flex-row flex-wrap items-center gap-6 px-8 py-3">
					{members.map((member) => {
						const partImage = getPartImage(member.part);
						return (
							<div key={member.id} className="flex items-center gap-4">
								<div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[19.5px] bg-[#F3F4F6]">
									{partImage ? (
										<Image
											width={40}
											height={40}
											src={partImage}
											alt={`${member.name} 프로필`}
											className="size-10 rounded-[19.5px] object-cover"
										/>
									) : (
										<div className="size-10 rounded-[19.5px] bg-[#F3F4F6]" />
									)}
								</div>
								<span className="font-semibold text-[16px] leading-[150%] text-[#1F2937]">
									{member.name}
								</span>
							</div>
						);
					})}
				</div>

				{/* Contents - padding 24px 32px, gap 24px */}
				<div className="flex w-full flex-col gap-6 px-8 py-6">
					{/* Part - gap 8px, label 16px semibold #4B5563, toggle h-12 border #D1D5DB rounded-lg */}
					<div className="flex flex-col gap-2">
						<span className="h-6 font-semibold text-[16px] leading-[150%] text-[#4B5563]">
							파트
						</span>
						<div className="flex h-12 w-full overflow-hidden rounded-lg border border-[#D1D5DB]">
							<ToggleGroup
								type="single"
								value={selectedPart}
								onValueChange={(v) => v && setSelectedPart(v as Part)}
								className="flex h-full w-full flex-row items-stretch"
							>
								{PART_OPTIONS.map((opt) => (
									<ToggleGroupItem key={opt.value} value={opt.value} className={TOGGLE_ITEM_CLASS}>
										{opt.label}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
						</div>
					</div>

					{/* Team - gap 8px */}
					<div className="flex flex-col gap-2">
						<span className="h-6 font-semibold text-[16px] leading-[150%] text-[#4B5563]">
							팀 정보 입력
						</span>
						<div className="flex h-12 w-full overflow-hidden rounded-lg border border-[#D1D5DB]">
							<ToggleGroup
								type="single"
								value={selectedTeam}
								onValueChange={(v) => v && setSelectedTeam(v)}
								className="flex h-full w-full flex-row items-stretch"
							>
								{TEAM_OPTIONS.map((opt) => (
									<ToggleGroupItem key={opt.value} value={opt.value} className={TOGGLE_ITEM_CLASS}>
										{opt.label}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
						</div>
					</div>
				</div>

				{/* Footer - padding 24px 32px 32px, button h-12 rounded-lg #1F2937 */}
				<div className="flex w-full flex-col items-center px-8 pb-8 pt-6">
					<button
						type="button"
						className="flex h-12 w-full items-center justify-center rounded-lg bg-[#1F2937] font-semibold text-[16px] leading-[150%] text-white"
						onClick={handleSubmit}
					>
						수정하기
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
