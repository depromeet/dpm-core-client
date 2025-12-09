import Link from 'next/link';
import { Ellipsis, Pencil } from 'lucide-react';
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@dpm-core/shared';

import { SessionDeleteAlert } from './SessionDeleteAlert';

interface SessionDropDownMenuProps {
	sessionId: number;
}

export const SessionDropDownMenu = ({ sessionId }: SessionDropDownMenuProps) => {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="none"
					size="none"
					className="rounded-lg p-2 hover:bg-background-hover data-[state=open]:bg-background-hover"
				>
					<Ellipsis className="text-icon-noraml" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				alignOffset={0}
				className="flex w-fit min-w-0 items-center justify-center rounded-lg border-none bg-background-normal px-4 py-3 shadow-[0_-4px_21.1px_0_rgba(0,0,0,0.12)]"
			>
				<DropdownMenuLabel className="sr-only">세션 수정 및 삭제</DropdownMenuLabel>
				<div className="inline-flex gap-3 font-semibold text-body2 text-label-alternative">
					<DropdownMenuItem asChild className="cursor-pointer gap-1.5 p-0">
						<Link href={`/session/${sessionId}/modify`}>
							<Pencil size={16} />
							수정
						</Link>
					</DropdownMenuItem>
					<div className="w-px bg-line-normal" />
					<SessionDeleteAlert sessionId={sessionId} />
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
