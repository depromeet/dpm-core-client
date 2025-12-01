import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@dpm-core/shared';

interface SessionModifyConfirmModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: () => void;
}

export const SessionModifyConfirmModal = (props: SessionModifyConfirmModalProps) => {
	const { open, onOpenChange, onSubmit } = props;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[640px]" showCloseButton={false}>
				<DialogHeader className="text-left">
					<DialogTitle>세션 정보를 저장할까요?</DialogTitle>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="assistive" size="lg" className="flex-1">
							취소
						</Button>
					</DialogClose>
					<Button variant="secondary" size="lg" className="flex-1" onClick={onSubmit}>
						저장
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
