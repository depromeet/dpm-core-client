'use client';

import Image from 'next/image';
import { XIcon } from 'lucide-react';
import {
	Button,
	cn,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@dpm-core/shared';

import EtcIcon from '@/assets/icons/etc.webp';
import { cohort } from '@/constants/cohort';
import { getMemberPartLabel } from '@/lib/member/part';
import { isExistPart } from '@/lib/utils';

import type { MemberListItem } from '../_types';

interface ApproveMemberModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	members: MemberListItem[];
	onApprove: () => void;
	onReject: () => void;
}

function getTeamLabel(member: MemberListItem): string {
	return member.teamNumber === 0 ? '미배정' : `${member.teamNumber}팀`;
}

function getPartLabel(member: MemberListItem): string {
	if (member.part === 'ETC') return '미배정';
	return getMemberPartLabel(member.part);
}

export const ApproveMemberModal = ({
	open,
	onOpenChange,
	members,
	onApprove,
	onReject,
}: ApproveMemberModalProps) => {
	const handleApprove = () => {
		onApprove();
		onOpenChange(false);
	};

	const handleReject = () => {
		onReject();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="flex w-[640px] max-w-[640px] flex-col items-start gap-0 rounded-2xl bg-white p-0 shadow-[0px_18px_33px_rgba(0,0,0,0.02),0px_8px_40px_rgba(0,0,0,0.1),0px_0px_6px_rgba(0,0,0,0.1)] sm:max-w-[640px]"
				showCloseButton={false}
			>
				<DialogClose
					className="absolute top-8 right-8 flex size-7 items-center justify-center rounded-full bg-[#F3F4F6] p-1.5"
					aria-label="닫기"
				>
					<XIcon className="size-4 text-[#6B7280]" />
				</DialogClose>
				<DialogHeader className="flex w-full flex-row items-start justify-end gap-3 self-stretch px-8 pt-8 pb-4">
					<div className="flex flex-1 flex-col items-start gap-3">
						<DialogTitle className="font-bold text-[#1F2937] text-[22px] leading-[136%] tracking-[-0.02em]">
							멤버 승인하기
						</DialogTitle>
						<DialogDescription className="font-medium text-[#81898F] text-[14px] leading-[22px]">
							멤버의 정보가 맞는지 확인해주세요
						</DialogDescription>
					</div>
				</DialogHeader>

				<div className="flex w-full flex-col self-stretch">
					{members.map((member) => (
						<div key={member.id} className="flex h-16 w-full flex-row items-center gap-4 px-8 py-3">
							<div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[19.5px] bg-[#F3F4F6]">
								<Image
									width={40}
									height={40}
									src={
										member.part === 'ETC'
											? EtcIcon
											: isExistPart(member.part)
												? cohort[member.part]
												: cohort.WEB
									}
									alt={member.part === 'ETC' ? '파트 미배정' : `${member.name} 프로필`}
									className="size-10 rounded-[19.5px] object-cover"
								/>
							</div>
							<div className="flex flex-row flex-wrap items-center gap-3">
								<span className="font-semibold text-[#1F2937] text-body1 leading-[150%]">
									{member.name}
								</span>
								<div className="h-4 w-px shrink-0 bg-[rgba(107,114,128,0.2)]" />
								<span className="font-semibold text-[#1F2937] text-body1 leading-[150%]">
									{getTeamLabel(member)}
								</span>
								<div className="h-4 w-px shrink-0 bg-[rgba(107,114,128,0.2)]" />
								<span className="font-semibold text-[#1F2937] text-body1 leading-[150%]">
									{getPartLabel(member)}
								</span>
							</div>
						</div>
					))}
				</div>

				<DialogFooter className="flex h-[104px] w-full flex-row items-start gap-2 self-stretch px-8 pt-6 pb-8">
					<div
						className={cn(
							'relative flex h-12 flex-1 basis-0 flex-col items-center justify-center rounded-lg bg-[#1F2937] px-5 py-3 opacity-40',
							members.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer',
						)}
					>
						<button
							type="button"
							className="absolute inset-0 cursor-inherit rounded-lg"
							disabled={members.length === 0}
							onClick={handleReject}
						/>
						<span className="relative font-semibold text-body1 text-white leading-[150%]">
							반려하기
						</span>
					</div>
					<div
						className={cn(
							'flex h-12 flex-1 basis-0',
							members.length === 0 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
						)}
					>
						<Button
							variant="secondary"
							size="lg"
							className="h-12 w-full rounded-lg px-5 py-3"
							disabled={members.length === 0}
							onClick={handleApprove}
						>
							승인하기
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
