'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MemberOverviewItem } from '@dpm-core/api';
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	SearchInputOutlined,
	StatusBadge,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	toast,
} from '@dpm-core/shared';

import { hardDeleteMemberMutationOptions } from '@/remotes/mutations/member';
import { getMembersOverviewQuery } from '@/remotes/queries/member';

const statusBadgeStatus = (status: string) => {
	switch (status) {
		case 'ACTIVE':
			return 'success';
		case 'PENDING':
			return 'pending';
		case 'INACTIVE':
			return 'warning';
		case 'WITHDRAWN':
			return 'error';
		default:
			return 'default';
	}
};

export const UserHardDelete = () => {
	const queryClient = useQueryClient();
	const { data: membersData } = useQuery(getMembersOverviewQuery());
	const members = membersData?.data.members ?? [];

	const [searchQuery, setSearchQuery] = useState('');
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [targetMember, setTargetMember] = useState<MemberOverviewItem | null>(null);

	const { mutate: hardDeleteMember, isPending } = useMutation(
		hardDeleteMemberMutationOptions({
			onSuccess: () => {
				toast.success('멤버가 삭제되었습니다.');
				queryClient.invalidateQueries({ queryKey: ['members-overview'] });
				setConfirmDialogOpen(false);
				setTargetMember(null);
			},
			onError: (error) => {
				toast.error(error.message || '멤버 삭제에 실패했습니다.');
			},
		}),
	);

	const searchResults = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return [];

		return members.filter(
			(m) =>
				m.name.toLowerCase().includes(query) ||
				String(m.memberId).includes(query) ||
				(m.email && m.email.toLowerCase().includes(query)),
		);
	}, [members, searchQuery]);

	const openConfirmDialog = (member: MemberOverviewItem) => {
		setTargetMember(member);
		setConfirmDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		if (!targetMember) return;
		hardDeleteMember(targetMember.memberId);
	};

	return (
		<div className="flex w-full flex-col gap-6">
			<div className="flex flex-col gap-2">
				<span className="font-bold text-label-normal text-title1">유저 하드 딜리트</span>
				<p className="text-body2 text-label-subtle">
					기존 계정 정보에서 member_oauth 값과 이메일만 변경하여 하드 딜리트된 것처럼 처리합니다.
				</p>
			</div>

			{/* Search */}
			<div className="w-[400px]">
				<SearchInputOutlined
					placeholder="유저 ID, 이름 또는 이메일 검색"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="h-10 w-full"
				/>
			</div>

			{/* Results */}
			{!searchQuery.trim() ? (
				<div className="flex min-h-[200px] w-full items-center justify-center rounded-lg border border-line-normal py-12">
					<p className="font-medium text-body1 text-label-assistive">
						유저를 검색하여 삭제 대상을 선택하세요
					</p>
				</div>
			) : searchResults.length === 0 ? (
				<div className="flex min-h-[200px] w-full items-center justify-center rounded-lg border border-line-normal py-12">
					<p className="font-medium text-body1 text-label-assistive">검색 결과가 없습니다</p>
				</div>
			) : (
				<Table className="w-full">
					<TableHeader>
						<TableRow className="h-10 border-0 bg-background-strong hover:bg-background-strong">
							<TableHead className="px-3 font-medium text-body2 text-label-subtle">ID</TableHead>
							<TableHead className="px-3 font-medium text-body2 text-label-subtle">이름</TableHead>
							<TableHead className="px-3 font-medium text-body2 text-label-subtle">파트</TableHead>
							<TableHead className="px-3 font-medium text-body2 text-label-subtle">상태</TableHead>
							<TableHead className="w-[100px] px-3 text-right font-medium text-body2 text-label-subtle">
								관리
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{searchResults.map((m) => (
							<TableRow key={m.memberId} className="h-[56px] border-line-subtle">
								<TableCell className="px-3 font-medium text-body1 text-label-normal">
									{m.memberId}
								</TableCell>
								<TableCell className="px-3 font-medium text-body1 text-label-normal">
									{m.name}
								</TableCell>
								<TableCell className="px-3 font-medium text-body1 text-label-normal">
									{m.part}
								</TableCell>
								<TableCell className="px-3">
									<StatusBadge status={statusBadgeStatus(m.status)}>{m.status}</StatusBadge>
								</TableCell>
								<TableCell className="px-3 text-right">
									<button
										type="button"
										className="cursor-pointer rounded-md px-3 py-1.5 font-medium text-body2 text-status-danger hover:bg-red-50"
										onClick={() => openConfirmDialog(m)}
									>
										삭제
									</button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			{/* Confirm Dialog */}
			<Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>유저 삭제 확인</DialogTitle>
						<DialogDescription>
							{targetMember?.name}(ID: {targetMember?.memberId}) 유저를 하드 딜리트
							처리하시겠습니까?
							<br />
							member_oauth 값과 이메일이 변경되며, 이 작업은 되돌릴 수 없습니다.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="assistive">취소</Button>
						</DialogClose>
						<Button variant="secondary" onClick={handleConfirmDelete} disabled={isPending}>
							{isPending ? '삭제 중...' : '삭제'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
