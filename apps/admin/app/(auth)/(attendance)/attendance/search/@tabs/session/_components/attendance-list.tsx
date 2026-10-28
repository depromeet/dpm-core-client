'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { type AttendanceBySessionMember, type AttendanceStatus, attendance } from '@dpm-core/api';
import {
	ATTENDANCE_STATUS_OPTIONS,
	Button,
	cn,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	formatTimeOnly,
	TableCheckbox,
} from '@dpm-core/shared';

import { AttendanceStatusLabel, EmptyView, Profile } from '@/components/attendance';
import { toast } from '@/lib/toast';
import { ATTENDANCE_QUERY_KEY } from '@/remotes/queries/attendance';
import { invalidateMemberManagement } from '@/remotes/queries/member';

import { AttendanceSessionDetailDrawer } from './attendance-session-detail-drawer';

interface AttendanceListProps {
	data: AttendanceBySessionMember[];
	sessionId: number;
	selectedIds: number[];
	onToggleItem: (id: number) => void;
	onToggleAll: () => void;
	isAllSelected: boolean;
}

interface AttendanceStatusSelectProps {
	member: AttendanceBySessionMember;
	sessionId: number;
}

function AttendanceStatusSelect({ member, sessionId }: AttendanceStatusSelectProps) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (attendanceStatus: AttendanceStatus) =>
			attendance.modifyAttendanceStatus({ sessionId, memberId: member.id, attendanceStatus }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY] });
			invalidateMemberManagement(queryClient);
			toast.success('출석 정보를 저장했습니다.');
		},
		onError: () => toast.error('출석 정보 수정에 실패했습니다.'),
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="none" size="none" disabled={mutation.isPending} className="gap-2 py-2">
					<AttendanceStatusLabel status={member.attendanceStatus} />
					<ChevronDown size={24} className="text-label-assistive" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				className="w-55 rounded-lg border-0 bg-background-normal p-2 text-label-normal shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] ring-1 ring-line-normal ring-inset"
			>
				{ATTENDANCE_STATUS_OPTIONS.map((option) => (
					<DropdownMenuItem
						key={option.value}
						onSelect={() => {
							if (option.value !== member.attendanceStatus) mutation.mutate(option.value);
						}}
						className={cn(
							'h-8 justify-between py-0 focus:bg-background-strong',
							option.value === member.attendanceStatus && 'bg-background-strong',
						)}
					>
						<AttendanceStatusLabel status={option.value} />
						{option.value === member.attendanceStatus ? (
							<span className="text-caption1 text-label-assistive">선택됨</span>
						) : null}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default function AttendanceList({
	data,
	sessionId,
	selectedIds,
	onToggleItem,
	onToggleAll,
	isAllSelected,
}: AttendanceListProps) {
	const [memberId, setMemberId] = useState<number | null>(null);

	if (data.length === 0) {
		return <EmptyView className="min-h-0" message="조건에 맞는 디퍼가 없어요." />;
	}

	return (
		<section className="min-h-0 flex-1 overflow-auto px-10 pb-24">
			<table className="w-full min-w-200 table-fixed border-collapse text-left">
				<colgroup>
					<col className="w-10" />
					<col className="w-[36%]" />
					<col className="w-[18%]" />
					<col className="w-[16%]" />
					<col />
				</colgroup>
				<thead className="bg-background-subtle font-medium text-caption1 text-label-subtle">
					<tr className="h-10">
						<th className="pl-3">
							<TableCheckbox
								className="size-4"
								checked={isAllSelected}
								onCheckedChange={onToggleAll}
								title="전체 선택"
							/>
						</th>
						<th className="font-medium">멤버 정보</th>
						<th className="font-medium">출석 상태</th>
						<th className="font-medium">출석 시간</th>
						<th className="font-medium">결석 사유서</th>
					</tr>
				</thead>
				<tbody>
					{data.map((member) => (
						<tr key={member.id} className="h-17.5 border-line-subtle border-b text-body2">
							<td className="pl-3">
								<TableCheckbox
									className="size-4"
									checked={selectedIds.includes(member.id)}
									onCheckedChange={() => onToggleItem(member.id)}
									title={`${member.name} 선택`}
								/>
							</td>
							<td>
								<button
									type="button"
									onClick={() => setMemberId(member.id)}
									className="cursor-pointer py-3 text-left"
								>
									<Profile
										name={member.name}
										part={member.part}
										teamNumber={member.teamNumber}
										isAdmin={member.isAdmin}
										size={40}
										inline
									/>
								</button>
							</td>
							<td>
								<AttendanceStatusSelect member={member} sessionId={sessionId} />
							</td>
							<td className="text-label-subtle">
								{member.attendedAt !== null && !member.isManuallyUpdated
									? formatTimeOnly(member.attendedAt)
									: '-'}
							</td>
							<td className="pr-3 text-label-subtle">
								{member.absenceReason !== null ? (
									<button
										type="button"
										className="line-clamp-2 cursor-pointer break-all text-left"
										onClick={() => setMemberId(member.id)}
									>
										{member.absenceReason}
									</button>
								) : (
									'-'
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{memberId !== null ? (
				<AttendanceSessionDetailDrawer
					key={memberId}
					memberId={memberId}
					sessionId={sessionId}
					open
					onOpenChange={(open) => {
						if (!open) setMemberId(null);
					}}
				/>
			) : null}
		</section>
	);
}
