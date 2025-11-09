import Link from 'next/link';
import type { RefObject } from 'react';
import { useState } from 'react';
import type { AttendanceStatus } from '@dpm-core/api';
import { Checkbox } from '@dpm-core/shared';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { EmptyView } from '@/components/attendance/EmptyView';
import { Profile } from '@/components/attendance/profile';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';

import { AttendanceSessionDetailDrawer } from './attendance-session-detail-drawer';

interface AttendanceMember {
	id: number;
	name: string;
	teamNumber: number;
	part: 'WEB' | 'ANDROID' | 'IOS' | 'DESIGN' | 'SERVER';
	attendanceStatus: AttendanceStatus;
}

interface AttendanceListProps {
	data: AttendanceMember[];
	targetRef: RefObject<HTMLDivElement | null>;
	selectedIds: Set<number>;
	onToggleItem: (id: number) => void;
	onToggleAll: () => void;
	isAllSelected: boolean;
}

const AttendanceList = ({
	data,
	targetRef,
	selectedIds,
	onToggleItem,
	onToggleAll,
	isAllSelected,
}: AttendanceListProps) => {
	const customSearchParams = useCustomSearchParams();
	const searchParams = customSearchParams.getAll();

	const [selectedMember, setSelectedMember] = useState<{
		memberId: number;
		sessionId: number;
	} | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const handleDesktopRowClick = (memberId: number) => {
		setSelectedMember({ memberId, sessionId: Number(searchParams.week) });
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
				{data.map((member) => {
					return (
						<Link
							href={`/attendance/${member.id}/${searchParams.week}`}
							className="flex justify-between py-3"
							key={member.id}
						>
							<Profile
								size={40}
								name={member.name}
								teamNumber={member.teamNumber}
								part={member.part}
							/>
							<AttendanceStatusLabel status={member.attendanceStatus} />
						</Link>
					);
				})}
				<div ref={targetRef} />
			</section>

			{/* Desktop view (>= 768px) */}
			<section className="relative mx-10 mb-15 hidden md:block">
				<div className="overflow-auto">
					<div className="flex items-center justify-between border-gray-200 border-b bg-gray-50 py-2.5 pr-[136px] pl-5">
						<div className="flex items-center gap-4">
							<Checkbox
								checked={isAllSelected}
								onCheckedChange={onToggleAll}
								className="size-4 cursor-pointer rounded-sm border-line-normal text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
								aria-label="전체 선택"
							/>
							<span className="font-medium text-body2 text-label-subtle">멤버 정보</span>
						</div>
						<span className="font-medium text-body2 text-label-subtle">출석 상태</span>
					</div>

					{data.map((member) => {
						const isChecked = selectedIds.has(member.id);
						return (
							// biome-ignore lint/a11y/useSemanticElements: Checkbox가 버튼 컴포넌트임으로 nested button 이슈를 해결하기 위해 div role button을 사용
							<div
								key={member.id}
								role="button"
								tabIndex={0}
								onClick={() => handleDesktopRowClick(member.id)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										handleDesktopRowClick(member.id);
									}
								}}
								className="flex w-full cursor-pointer items-center justify-between border-gray-200 border-b py-5 pr-[136px] pl-5 text-left transition-colors hover:bg-gray-50"
							>
								<div className="flex items-center gap-4">
									<Checkbox
										checked={isChecked}
										onCheckedChange={() => onToggleItem(member.id)}
										className="size-4 cursor-pointer rounded-sm border-line-normal text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
										aria-label={`${member.name} 선택`}
										onClick={(e) => e.stopPropagation()}
									/>
									<Profile
										size={40}
										name={member.name}
										teamNumber={member.teamNumber}
										part={member.part}
									/>
								</div>
								<AttendanceStatusLabel status={member.attendanceStatus} />
							</div>
						);
					})}
				</div>
				<div ref={targetRef} />

				{selectedMember && (
					<AttendanceSessionDetailDrawer
						memberId={selectedMember.memberId}
						sessionId={selectedMember.sessionId}
						open={isDrawerOpen}
						onOpenChange={setIsDrawerOpen}
					/>
				)}
			</section>
		</>
	);
};

export default AttendanceList;
