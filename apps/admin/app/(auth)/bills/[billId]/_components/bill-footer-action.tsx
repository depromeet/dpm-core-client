'use client';

import type { BillStatus } from '@dpm-core/api';
import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	useAppShell,
} from '@dpm-core/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { closeBillParticipationMutationOptions } from '@/remotes/mutations/bill';
import { getBillDetailByIdQueryOptions } from '@/remotes/queries/bill';

export const BillFooterAction = ({
	billStatus,
	billId,
}: {
	billStatus: BillStatus;
	billId: number;
}) => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate: closeBillParticipationMutate, isPending } = useMutation(
		closeBillParticipationMutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(getBillDetailByIdQueryOptions(billId));
				router.push(`/bills/${billId}/done`);
			},
			onError: () => {},
		}),
	);
	const handleCloseBillParticipation = () => {
		closeBillParticipationMutate({ billId });
	};

	// TODO : 정산 종료 API 추가
	switch (billStatus) {
		case 'OPEN':
			return <OpenStatusButton onClick={handleCloseBillParticipation} disabled={isPending} />;
		case 'IN_PROGRESS':
			return <InProgressStatusButton />;
		case 'COMPLETED':
			return null;
		default:
			return null;
	}
};

const OpenStatusButton = ({ disabled, ...props }: React.ComponentProps<'button'>) => {
	const { ref } = useAppShell();

	return createPortal(
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					type="button"
					disabled={disabled}
					size="full"
					variant="secondary"
					className="fixed bottom-0 w-full mx-auto"
					style={{
						maxWidth: ref.current.clientWidth,
					}}
				>
					멤버 확정하기
				</Button>
			</DrawerTrigger>
			<DrawerContent className="mx-auto max-w-lg">
				<DrawerHeader className="px-5 mb-3">
					<DrawerTitle>제출 전 확인</DrawerTitle>
				</DrawerHeader>
				<DrawerDescription className="px-5 mb-3">
					<span>
						-
						<strong className="text-red-500 font-medium"> 멤버 확정 후에는 참석 여부를 수정</strong>
						할 수 없습니다.
					</span>
					<br />
					<span>- 수정이 필요한 경우, 정산서를 삭제하고 새로 만들어야 합니다.</span>
					<br />
					<span>- 확정 전에는 꼭 한 번 더 확인해 주세요.</span>
				</DrawerDescription>
				<DrawerFooter>
					<div className="flex gap-2">
						<DrawerClose asChild>
							<Button
								type="button"
								variant="assistive"
								size="lg"
								className="flex-1"
								disabled={disabled}
							>
								다시 확인하기
							</Button>
						</DrawerClose>
						<Button
							type="submit"
							variant="none"
							size="lg"
							className="flex-1 bg-red-400 text-label-inverse"
							disabled={disabled}
							{...props}
						>
							확정하기
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>,
		ref.current,
	);
};

const InProgressStatusButton = ({ disabled, ...props }: React.ComponentProps<'button'>) => {
	const { ref } = useAppShell();

	return createPortal(
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					type="button"
					disabled={disabled}
					size="full"
					variant="secondary"
					className="fixed bottom-0 w-full mx-auto"
					style={{
						maxWidth: ref.current.clientWidth,
					}}
				>
					정산 종료하기
				</Button>
			</DrawerTrigger>
			<DrawerContent className="mx-auto max-w-lg">
				<DrawerHeader className="px-5 mb-3">
					<DrawerTitle>정산 종료 전 확인</DrawerTitle>
				</DrawerHeader>
				<DrawerDescription className="px-5 mb-3">
					<span>- 정산이 종료되면 상태가 ‘정산 끝’으로 변경됩니다.</span>
					<br />
					<span>
						-{' '}
						<strong className="text-red-500 font-medium">
							정산 종료 후에는 링크 복사 및 추가 편집이 불가능
						</strong>
						합니다.
					</span>
					<br />
					<span>- 정산 종료는 최종 확정입니다. 변경이 어려우니 꼭 다시 한 번 확인해 주세요.</span>
				</DrawerDescription>
				<DrawerFooter>
					<div className="flex gap-2">
						<DrawerClose asChild>
							<Button
								type="button"
								variant="assistive"
								size="lg"
								className="flex-1"
								disabled={disabled}
							>
								다시 확인하기
							</Button>
						</DrawerClose>
						<Button
							type="submit"
							variant="none"
							size="lg"
							className="flex-1 bg-red-400 text-label-inverse"
							disabled={disabled}
							{...props}
						>
							정산 종료하기
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>,
		ref.current,
	);
};
