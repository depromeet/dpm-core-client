'use client';

import { useState } from 'react';
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	toast,
} from '@dpm-core/shared';

interface CohortItem {
	cohortId: number;
	cohortNumber: string;
}

// TODO: API 연동 후 제거
const MOCK_COHORTS: CohortItem[] = [
	{ cohortId: 1, cohortNumber: '15기' },
	{ cohortId: 2, cohortNumber: '16기' },
	{ cohortId: 3, cohortNumber: '17기' },
];

export const CohortManagement = () => {
	const [cohorts, setCohorts] = useState<CohortItem[]>(MOCK_COHORTS);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [editTarget, setEditTarget] = useState<CohortItem | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<CohortItem | null>(null);

	const handleCreate = () => {
		if (!inputValue.trim()) return;
		// TODO: API 연동
		const newCohort: CohortItem = {
			cohortId: Math.max(0, ...cohorts.map((c) => c.cohortId)) + 1,
			cohortNumber: inputValue.trim(),
		};
		setCohorts((prev) => [...prev, newCohort]);
		setCreateDialogOpen(false);
		setInputValue('');
		toast.success('기수가 생성되었습니다.');
	};

	const handleEdit = () => {
		if (!editTarget || !inputValue.trim()) return;
		// TODO: API 연동
		setCohorts((prev) =>
			prev.map((c) =>
				c.cohortId === editTarget.cohortId ? { ...c, cohortNumber: inputValue.trim() } : c,
			),
		);
		setEditDialogOpen(false);
		setEditTarget(null);
		setInputValue('');
		toast.success('기수가 수정되었습니다.');
	};

	const handleDelete = () => {
		if (!deleteTarget) return;
		// TODO: API 연동
		setCohorts((prev) => prev.filter((c) => c.cohortId !== deleteTarget.cohortId));
		setDeleteDialogOpen(false);
		setDeleteTarget(null);
		toast.success('기수가 삭제되었습니다.');
	};

	const openEditDialog = (item: CohortItem) => {
		setEditTarget(item);
		setInputValue(item.cohortNumber);
		setEditDialogOpen(true);
	};

	const openDeleteDialog = (item: CohortItem) => {
		setDeleteTarget(item);
		setDeleteDialogOpen(true);
	};

	return (
		<div className="flex w-full flex-col gap-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="font-bold text-label-normal text-title1">기수 목록</span>
					<span className="font-medium text-body1 text-primary-normal">{cohorts.length}</span>
				</div>
				<Button
					onClick={() => {
						setInputValue('');
						setCreateDialogOpen(true);
					}}
				>
					기수 추가
				</Button>
			</div>

			{/* Table */}
			{cohorts.length === 0 ? (
				<div className="flex min-h-[200px] w-full items-center justify-center py-12">
					<p className="font-medium text-body1 text-label-assistive">등록된 기수가 없습니다</p>
				</div>
			) : (
				<Table className="w-full">
					<TableHeader>
						<TableRow className="h-10 border-0 bg-background-strong hover:bg-background-strong">
							<TableHead className="px-3 font-medium text-body2 text-label-subtle">
								기수 ID
							</TableHead>
							<TableHead className="px-3 font-medium text-body2 text-label-subtle">
								기수명
							</TableHead>
							<TableHead className="w-[200px] px-3 text-right font-medium text-body2 text-label-subtle">
								관리
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{cohorts.map((c) => (
							<TableRow key={c.cohortId} className="h-[56px] border-line-subtle">
								<TableCell className="px-3 font-medium text-body1 text-label-normal">
									{c.cohortId}
								</TableCell>
								<TableCell className="px-3 font-medium text-body1 text-label-normal">
									{c.cohortNumber}
								</TableCell>
								<TableCell className="flex items-center justify-end gap-2 px-3">
									<button
										type="button"
										className="cursor-pointer rounded-md px-3 py-1.5 font-medium text-body2 text-label-normal hover:bg-background-strong"
										onClick={() => openEditDialog(c)}
									>
										수정
									</button>
									<button
										type="button"
										className="cursor-pointer rounded-md px-3 py-1.5 font-medium text-body2 text-status-danger hover:bg-red-50"
										onClick={() => openDeleteDialog(c)}
									>
										삭제
									</button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			{/* Create Dialog */}
			<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>기수 추가</DialogTitle>
						<DialogDescription>새로운 기수를 생성합니다. 최신 기수 역할이 자동 생성됩니다.</DialogDescription>
					</DialogHeader>
					<input
						type="text"
						placeholder="기수명 (예: 17기)"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						className="w-full rounded-lg border border-line-normal bg-background-normal px-4 py-3 font-medium text-body1 text-label-normal outline-none focus:border-primary-normal"
					/>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="assistive">취소</Button>
						</DialogClose>
						<Button onClick={handleCreate} disabled={!inputValue.trim()}>
							생성
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>기수 수정</DialogTitle>
						<DialogDescription>
							{editTarget?.cohortNumber} 기수의 값을 수정합니다.
						</DialogDescription>
					</DialogHeader>
					<input
						type="text"
						placeholder="기수명"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						className="w-full rounded-lg border border-line-normal bg-background-normal px-4 py-3 font-medium text-body1 text-label-normal outline-none focus:border-primary-normal"
					/>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="assistive">취소</Button>
						</DialogClose>
						<Button onClick={handleEdit} disabled={!inputValue.trim()}>
							수정
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>기수 삭제</DialogTitle>
						<DialogDescription>
							{deleteTarget?.cohortNumber} 기수를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="assistive">취소</Button>
						</DialogClose>
						<Button variant="secondary" onClick={handleDelete}>
							삭제
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
