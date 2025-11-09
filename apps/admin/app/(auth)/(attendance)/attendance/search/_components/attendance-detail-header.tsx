import { Button, ChevronLeft, SheetClose, SheetHeader, SheetTitle, XCircle } from '@dpm-core/shared';

interface AttendanceDetailHeaderProps {
	title: string;
	onBack?: () => void;
}

export const AttendanceDetailHeader = ({ title, onBack }: AttendanceDetailHeaderProps) => {
	return (
		<SheetHeader
			className={`flex-row items-center justify-between border-gray-200 border-b py-6 pr-10 ${onBack ? 'pl-6' : 'pl-10'}`}
		>
			{onBack ? (
				<div className="flex items-center gap-3">
					<Button variant="none" size="none" onClick={onBack} className="size-6">
						<ChevronLeft className="size-6 text-icon-normal" />
					</Button>
					<SheetTitle className="font-semibold text-headline2 text-label-normal">{title}</SheetTitle>
				</div>
			) : (
				<SheetTitle className="font-semibold text-headline2 text-label-normal">{title}</SheetTitle>
			)}
			<SheetClose asChild>
				<Button variant="none" size="none" className="size-6">
					<XCircle className="size-6 text-icon-normal" />
				</Button>
			</SheetClose>
		</SheetHeader>
	);
};
