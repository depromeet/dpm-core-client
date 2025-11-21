import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@dpm-core/shared';

import { SessionInfoForm } from './SessionInfoForm';

export const SessionInfoModifyModal = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="md" variant="assistive">
					세션 기본 정보
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[640px]">
				<DialogHeader className="text-left">
					<DialogTitle>세션 기본 정보</DialogTitle>
					<DialogDescription>
						이 설정은 세션 생성 시 기본값으로 자동 입력되며, 필요할 때 수정할 수 있어요.
					</DialogDescription>
				</DialogHeader>
				<div className="mt-6">
					<SessionInfoForm />
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="secondary" size="lg" className="w-full" disabled>
							저장
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
