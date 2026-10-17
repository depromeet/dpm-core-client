import {
	Button,
	cn,
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@dpm-core/shared';

interface SessionSaveConfirmModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: () => void;
	title?: string;
	isPending?: boolean;
	isConfirmDisabled?: boolean;
	content?: React.ReactNode;
	contentClassName?: string;
}

export const SessionSaveConfirmModal = ({
	open,
	onOpenChange,
	onSubmit,
	title = '세션 정보를 저장할까요?',
	isPending = false,
	isConfirmDisabled = false,
	content,
	contentClassName,
}: SessionSaveConfirmModalProps) => {
	const handleSubmit = () => {
		onOpenChange(false);
		onSubmit();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={cn('w-fit max-w-[calc(100%-2rem)] sm:max-w-fit', contentClassName)}
				showCloseButton={false}
			>
				<DialogHeader className="text-left">
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				{content}
				<DialogFooter className="w-[368px] max-w-full">
					<DialogClose asChild>
						<Button
							variant="assistive"
							size="lg"
							className="h-[46px] max-w-[180px] flex-1"
							disabled={isPending}
						>
							취소
						</Button>
					</DialogClose>
					<Button
						variant="secondary"
						size="lg"
						className="h-[46px] max-w-[180px] flex-1"
						disabled={isPending || isConfirmDisabled}
						onClick={handleSubmit}
					>
						저장
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
