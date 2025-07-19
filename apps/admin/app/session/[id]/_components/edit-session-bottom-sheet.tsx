'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@dpm-core/shared';
import { useTransitionRouter } from 'next-view-transitions';
import { type PropsWithChildren, useState } from 'react';
import { useAppShell } from '@/providers/app-shell-provider';

const EditSessionBottomSheet = ({ children }: PropsWithChildren) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useTransitionRouter();
	const { ref } = useAppShell();

	const handleClose = () => {
		setIsOpen(false);
	};

	// const isDisabled = isLogoutPending || disabled;

	return (
		<Drawer activeSnapPoint={1} open={isOpen} onOpenChange={setIsOpen} container={ref.current}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent
				className="!px-2 mx-auto"
				style={{
					// FIXME: 바텀시트 위치 계산식 분리
					maxWidth: ref.current?.clientWidth ?? 'auto',
				}}
			>
				<DrawerTitle className="sr-only">출석/지각 시간 수정</DrawerTitle>
				<DrawerHeader className="!text-left !gap-y-2 items-start">
					<h3 className="text-title2 font-semibold text-label-normal">출석/지각 시간 수정</h3>
					<p className="text-body2 text-label-assistive font-medium">정말 로그아웃할까요?</p>
				</DrawerHeader>
			</DrawerContent>
		</Drawer>
	);
};

export { EditSessionBottomSheet };
