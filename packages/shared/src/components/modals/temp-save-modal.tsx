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
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-160">
				<DialogHeader className="pt-8 pb-4">
					<DialogTitle className="font-bold text-headline2 text-label-normal">임시저장</DialogTitle>
				</DialogHeader>

				<DialogDescription className="px-8 py-3 font-medium text-body1 text-label-subtle">
					지금까지 작성된 내용을 임시저장할까요?
					<br />
					나중에 이어서 작성할 수 있어요.
				</DialogDescription>

				<DialogFooter className="gap-2 pt-6 pb-8">
					<Button variant="secondary" size="lg" className="flex-1 opacity-40" onClick={onCancel}>
						취소
					</Button>
					<Button variant="secondary" size="lg" className="flex-1" onClick={onSave}>
						저장하기
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
