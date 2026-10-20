'use client';

import { CircleAlert, Trash2 } from 'lucide-react';
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableCheckbox,
	TableHead,
	TableHeader,
	TableRow,
} from '@dpm-core/shared';

import type { MemberRow } from '../_types';
import { MemberEmptyView } from './MemberEmptyView';
import { MemberPartChip } from './MemberFieldChip';
import { MemberLoginMethodIcon } from './MemberLoginMethodIcon';

interface PendingMemberTableProps {
	rows: MemberRow[];
	isSelected: (id: number) => boolean;
	isAllSelected: boolean;
	/** 더 불러올 페이지를 불러오는 동안 전체 선택 체크박스를 잠근다. */
	isTogglingAll?: boolean;
	onToggle: (id: number) => void;
	onToggleAll: () => void;
	onApprove: (row: MemberRow) => void;
	onReject: (row: MemberRow) => void;
}

/** 미승인 탭 테이블. 값은 수정할 수 없고 승인·반려만 할 수 있다. */
export const PendingMemberTable = ({
	rows,
	isSelected,
	isAllSelected,
	isTogglingAll = false,
	onToggle,
	onToggleAll,
	onApprove,
	onReject,
}: PendingMemberTableProps) => {
	if (rows.length === 0) return <MemberEmptyView />;

	return (
		<Table className="w-full table-fixed">
			<TableHeader>
				<TableRow className="h-10 border-0 bg-background-strong hover:bg-background-strong">
					<TableHead className="w-12 px-3 [&:has([role=checkbox])]:pr-0">
						<TableCheckbox
							checked={isAllSelected}
							disabled={isTogglingAll}
							onCheckedChange={onToggleAll}
							aria-label="전체 선택"
						/>
					</TableHead>
					<TableHead className="w-44 px-3 font-medium text-body2 text-label-subtle">파트</TableHead>
					<TableHead className="px-3 font-medium text-body2 text-label-subtle">이름</TableHead>
					<TableHead className="px-3 font-medium text-body2 text-label-subtle">가입 계정</TableHead>
					<TableHead className="w-36 px-3 text-right font-medium text-body2 text-label-subtle">
						계정 이상 여부
					</TableHead>
					<TableHead className="w-32 px-3 font-medium text-body2 text-label-subtle">
						가입 승인
					</TableHead>
					<TableHead className="w-24 px-3 text-right font-medium text-body2 text-label-subtle">
						가입 반려
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((row) => (
					<TableRow
						key={row.id}
						className="h-17.5 border-line-subtle hover:bg-background-strong/40"
					>
						<TableCell className="w-12 px-3 [&:has([role=checkbox])]:pr-0">
							<TableCheckbox
								checked={isSelected(row.id)}
								onCheckedChange={() => onToggle(row.id)}
								aria-label={`${row.name} 선택`}
							/>
						</TableCell>
						<TableCell className="w-44 px-3">
							<MemberPartChip part={row.part} />
						</TableCell>
						<TableCell className="truncate px-3 font-semibold text-body1 text-label-normal">
							{row.name}
						</TableCell>
						<TableCell className="truncate px-3 font-medium text-body2 text-label-subtle">
							<span className="flex items-center gap-1.5">
								<MemberLoginMethodIcon loginMethod={row.loginMethod} />
								<span className="truncate">{row.email ?? '-'}</span>
							</span>
						</TableCell>
						<TableCell className="w-36 px-3 text-right">
							{row.duplicateSuspected && (
								<span className="inline-flex items-center gap-1 font-medium text-body2 text-red-500">
									<CircleAlert className="size-4" />
									중복 의심
								</span>
							)}
						</TableCell>
						<TableCell className="w-32 px-3">
							<Button variant="primary" size="sm" onClick={() => onApprove(row)}>
								{row.duplicateSuspected ? '병합 후 승인' : '가입 승인'}
							</Button>
						</TableCell>
						<TableCell className="w-24 px-3 text-right">
							<button
								type="button"
								aria-label={`${row.name} 가입 반려`}
								onClick={() => onReject(row)}
								className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg bg-background-strong text-label-assistive transition-colors hover:bg-background-heavy"
							>
								<Trash2 className="size-4" />
							</button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
