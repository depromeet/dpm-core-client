'use client';

import { useState } from 'react';
import type { AttendanceMember, Part } from '@dpm-core/api';
import { Badge, ChevronRight } from '@dpm-core/shared';

import { EmptyView } from '@/components/attendance';
import { getAttendanceMemberStatusLabel } from '@/lib/attendance/status';

import { AttendanceMemberDetailDrawer } from './attendance-member-detail-drawer';

interface AttendanceListProps {
	data: AttendanceMember[];
	parts: Exclude<Part, 'ETC'>[];
}
const PART_LABELS: Record<Exclude<Part, 'ETC'>, string> = {
	DESIGN: '디자인',
	IOS: 'iOS',
	ANDROID: 'Android',
	WEB: 'Web',
	SERVER: '서버',
};
export function AttendanceList({ data, parts }: AttendanceListProps) {
	const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
	const columns = parts.map((part) => ({
		part,
		members: data.filter((member) => member.part === part),
	}));
	const gridStyle = { gridTemplateColumns: `repeat(${parts.length}, minmax(0, 1fr))` };
	return (
		<>
			{data.length === 0 ? (
				<div className="flex min-h-0 flex-1 items-center justify-center pb-15">
					<EmptyView message="조건에 맞는 디퍼가 없어요" />
				</div>
			) : (
				<div className="mx-10 flex min-h-0 flex-1 flex-col pb-15">
					<div className="grid shrink-0 gap-3" style={gridStyle}>
						{columns.map(({ part, members }) => (
							<h2
								key={part}
								className="rounded-t-2xl bg-background-subtle px-4 pt-4 pb-3 font-semibold text-label-normal text-title2"
							>
								{PART_LABELS[part]} <span className="text-primary-normal">{members.length}</span>
							</h2>
						))}
					</div>
					<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
						<div className="grid items-start gap-3" style={gridStyle}>
							{columns.map(({ part, members }) => (
								<section
									key={part}
									className="flex flex-col gap-3 rounded-b-2xl bg-background-subtle px-4 pb-4"
								>
									{members.length === 0 && (
										<div className="flex h-19.5 items-center justify-center text-body2 text-label-assistive">
											해당없음
										</div>
									)}
									{members.map((member) => (
										<button
											type="button"
											key={member.id}
											onClick={() => setSelectedMemberId(member.id)}
											className="flex min-h-19.5 min-w-0 cursor-pointer items-center justify-between gap-2.5 rounded-xl bg-background-normal px-4 py-3 text-left transition-colors hover:bg-primary-extralight"
										>
											<div className="flex min-w-0 flex-col items-start">
												<Badge variant={member.attendanceStatus}>
													{getAttendanceMemberStatusLabel(member.attendanceStatus)}
												</Badge>
												<p className="mt-2 flex w-full min-w-0 items-center gap-1.5">
													<span className="shrink-0 font-medium text-body2 text-label-assistive">
														{member.teamNumber === 0 ? '미배정' : `${member.teamNumber}팀`}
													</span>
													<span className="h-3.5 w-px shrink-0 bg-line-subtle" />
													<span className="break-all font-semibold text-body1 text-label-subtle">
														{member.name}
													</span>
												</p>
											</div>
											<ChevronRight className="size-4 shrink-0 text-label-assistive" />
										</button>
									))}
								</section>
							))}
						</div>
					</div>
				</div>
			)}
			{selectedMemberId !== null && (
				<AttendanceMemberDetailDrawer
					key={selectedMemberId}
					memberId={selectedMemberId}
					open
					onOpenChange={(open) => {
						if (!open) setSelectedMemberId(null);
					}}
				/>
			)}
		</>
	);
}
