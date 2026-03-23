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
	SearchInputOutlined,
	toast,
} from '@dpm-core/shared';

export const UserHardDelete = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [targetUser, setTargetUser] = useState<string | null>(null);

	const handleSearch = () => {
		// TODO: 유저 검색 API 연동
		toast.info('유저 검색 API 연동 후 구현 예정');
	};

	const handleConfirmDelete = () => {
		// TODO: member_oauth 값과 이메일 변경하여 하드 딜리트 처리
		toast.info('유저 삭제 API 연동 후 구현 예정');
		setConfirmDialogOpen(false);
		setTargetUser(null);
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
			<div className="flex items-center gap-3">
				<div className="w-[400px]">
					<SearchInputOutlined
						placeholder="유저 이름 또는 이메일 검색"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="h-10 w-full"
					/>
				</div>
				<Button onClick={handleSearch}>검색</Button>
			</div>

			{/* Placeholder */}
			<div className="flex min-h-[200px] w-full items-center justify-center rounded-lg border border-line-normal py-12">
				<p className="font-medium text-body1 text-label-assistive">
					유저를 검색하여 삭제 대상을 선택하세요
				</p>
			</div>

			{/* Confirm Dialog */}
			<Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>유저 삭제 확인</DialogTitle>
						<DialogDescription>
							{targetUser} 유저를 하드 딜리트 처리하시겠습니까?
							<br />
							member_oauth 값과 이메일이 변경되며, 이 작업은 되돌릴 수 없습니다.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="assistive">취소</Button>
						</DialogClose>
						<Button variant="secondary" onClick={handleConfirmDelete}>
							삭제
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
