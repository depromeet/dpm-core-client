import Link from 'next/link';
import type { RefObject } from 'react';
import { useState } from 'react';
import type { ExcuseDocumentStatus, MemberAttendanceStatus } from '@dpm-core/api';
import { Badge } from '@dpm-core/shared';

import { EmptyView } from '@/components/attendance/EmptyView';
import { ExcuseDocumentCell } from '@/components/attendance/ExcuseDocumentCell';
import { Profile } from '@/components/attendance/profile';
import { getAttendanceMemberStatusLabel } from '@/lib/attendance/status';

import { AttendanceMemberDetailDrawer } from './attendance-member-detail-drawer';

interface AttendanceMember {
	id: number;
	name: string;
	teamNumber: number;
	part: 'WEB' | 'ANDROID' | 'IOS' | 'DESIGN' | 'SERVER';
	attendanceStatus: MemberAttendanceStatus;
	isAdmin: boolean;
	// TODO: 백엔드 API 구현 후 optional(?) 제거 필요
	excuseDocumentStatus?: ExcuseDocumentStatus;
}


interface AttendanceListProps {
	data: AttendanceMember[];
	targetRef: RefObject<HTMLDivElement | null>;
}

export const AttendanceList = ({ data, targetRef }: AttendanceListProps) => {
	const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const handleDesktopRowClick = (memberId: number) => {
		setSelectedMemberId(memberId);
		setIsDrawerOpen(true);
	};

	if (data.length === 0) {
		return (
			<div className="md:flex md:min-h-[400px] md:items-center md:justify-center">
				<EmptyView message="조건에 맞는 디퍼를 찾을 수 없어요" />
			</div>
		);
	}

	return (
		<>
			{/* Mobile view (< 768px) */}
			<section className="relative mt-2 mb-15 flex-1 flex-col px-4 md:hidden">
				{data.map((member, index) => {
					return (
						<Link
							href={`/attendance/${member.id}`}
							className="flex items-center justify-between py-3"
							key={`${member.id}-${index}`}
						>
							<Profile
								size={40}
								name={member.name}
								teamNumber={member.teamNumber}
								part={member.part}
								isAdmin={member.isAdmin}
							/>
							{member.attendanceStatus !== 'NORMAL' && (
								<Badge variant={member.attendanceStatus}>
									{getAttendanceMemberStatusLabel(member.attendanceStatus)}
								</Badge>
							)}
						</Link>
					);
				})}
				<div ref={targetRef} />
			</section>

			{/* Desktop view (>= 768px) */}
			<section className="relative mx-10 mb-15 hidden md:block">
				<div className="overflow-auto">
					<div className="flex items-center bg-gray-50 py-2.5 pl-5 pr-5">
						<span className="flex-1 font-medium text-body2 text-label-subtle">멤버 정보</span>
						<span className="w-[120px] shrink-0 font-medium text-body2 text-label-subtle">
							결석 사유서
						</span>
						<span className="w-[136px] shrink-0 text-right font-medium text-body2 text-label-subtle">
							수료 상태
						</span>
					</div>

					{data.map((member, index) => {
						return (
							<button
								key={`${member.id}-${index}`}
								type="button"
								onClick={() => handleDesktopRowClick(member.id)}
								className="flex w-full cursor-pointer items-center border-gray-200 border-b py-5 pl-5 pr-5 text-left transition-colors hover:bg-gray-50"
							>
								<div className="flex-1">
									<Profile
										size={40}
										name={member.name}
										teamNumber={member.teamNumber}
										part={member.part}
										isAdmin={member.isAdmin}
									/>
								</div>
								<div className="w-[120px] shrink-0">
									{/* TODO: 백엔드 API 구현 후 excuseDocumentStatus 실제 데이터로 대체 필요 */}
									<ExcuseDocumentCell status={member.excuseDocumentStatus} />
								</div>
								<div className="flex w-[136px] shrink-0 justify-end">
									<Badge variant={member.attendanceStatus}>
										{getAttendanceMemberStatusLabel(member.attendanceStatus)}
									</Badge>
								</div>
							</button>
						);
					})}
				</div>
				<div ref={targetRef} />

				{/* Drawer for desktop */}
				{selectedMemberId && (
					<AttendanceMemberDetailDrawer
						memberId={selectedMemberId}
						open={isDrawerOpen}
						onOpenChange={setIsDrawerOpen}
					/>
				)}
			</section>
		</>
	);
};
