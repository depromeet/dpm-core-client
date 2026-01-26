'use client';

import { RadioListItem } from '../radio-list-item';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

export interface TempSaveItem {
	id: string;
	title: string;
	savedAt: string;
}

export interface TempLoadModalProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	items?: TempSaveItem[];
	selectedItemId?: string;
	onItemSelect?: (itemId: string) => void;
	onItemDelete?: (itemId: string) => void;
	onCancel?: () => void;
	onLoad?: () => void;
}

export const TempLoadModal = ({
	open = false,
	onOpenChange,
	items = [],
	selectedItemId,
	onItemSelect,
	onItemDelete,
	onCancel,
	onLoad,
}: TempLoadModalProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-160">
				<DialogHeader className="pt-8 pb-4">
					<DialogTitle className="font-bold text-headline2 text-label-normal">
						임시저장 불러오기
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-6 px-8 py-6">
					{items.map(({ id, title, savedAt }) => (
						<div
							key={id}
							onClick={() => onItemSelect?.(id)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									onItemSelect?.(id);
								}
							}}
							className="cursor-pointer"
						>
							<RadioListItem
								value={id}
								title={title}
								description={`${savedAt} 작성`}
								checked={selectedItemId === id}
								onDelete={() => onItemDelete?.(id)}
							/>
						</div>
					))}
				</div>

				<DialogFooter className="gap-2 pt-6 pb-8">
					<Button variant="secondary" size="lg" className="flex-1 opacity-40" onClick={onCancel}>
						취소
					</Button>
					<Button variant="secondary" size="lg" className="flex-1" onClick={onLoad}>
						불러오기
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
