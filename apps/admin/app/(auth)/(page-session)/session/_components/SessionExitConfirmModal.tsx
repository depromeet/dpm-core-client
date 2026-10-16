import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@dpm-core/shared';

interface SessionExitConfirmModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onExit: () => void;
}

export const SessionExitConfirmModal = ({
	open,
	onOpenChange,
	onExit,
}: SessionExitConfirmModalProps) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="gap-0 sm:max-w-[480px]" showCloseButton={false}>
			<DialogHeader className="gap-2 text-left">
				<DialogTitle className="text-title1">저장하지 않고 나가시겠어요?</DialogTitle>
				<DialogDescription>작성한 내용은 복구가 불가능합니다.</DialogDescription>
			</DialogHeader>
			<DialogFooter className="mt-6 gap-2">
				<DialogClose asChild>
					<Button variant="assistive" size="lg" className="h-12 flex-1">
						취소
					</Button>
				</DialogClose>
				<Button
					variant="none"
					size="lg"
					className="h-12 flex-1 bg-red-400 text-white hover:bg-red-500"
					onClick={onExit}
				>
					나가기
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
