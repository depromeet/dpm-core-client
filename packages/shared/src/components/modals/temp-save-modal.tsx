'use client';

import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog';

export interface TempSaveModalProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onCancel?: () => void;
	onSave?: () => void;
}

export const TempSaveModal = ({
	open = false,
	onOpenChange,
	onCancel,
	onSave,
}: TempSaveModalProps) => {
	const handleCancel = () => {
		onCancel?.();
		onOpenChange?.(false);
	};

	const handleSave = () => {
		onSave?.();
		onOpenChange?.(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="flex h-[254px] w-full max-w-[640px] flex-col gap-0 p-8 pt-8 pb-8 sm:max-w-[640px]"
				showCloseButton={false}
			>
				<DialogHeader className="shrink-0 pt-0 pb-4 text-left">
					<DialogTitle className="font-bold text-headline2 text-label-normal">임시저장</DialogTitle>
				</DialogHeader>

				<DialogDescription className="min-h-0 shrink-0 px-0 py-3 font-medium text-body1 text-gray-400">
					지금까지 작성된 내용을 임시저장할까요?
					<br />
					나중에 이어서 작성할 수 있어요.
				</DialogDescription>

				<DialogFooter className="mt-auto flex w-full shrink-0 flex-row gap-2 pt-6">
					<Button
						variant="secondary"
						size="lg"
						className="flex-1 bg-gray-400 text-white hover:bg-gray-500"
						onClick={handleCancel}
					>
						취소
					</Button>
					<Button variant="secondary" size="lg" className="flex-1" onClick={handleSave}>
						저장하기
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
