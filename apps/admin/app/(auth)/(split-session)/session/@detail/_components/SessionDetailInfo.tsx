'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type PropsWithChildren, Suspense } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import {
	Button,
	CopyButton,
	calcSessionAttendanceTime,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	GAPageTracker,
	toast,
} from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { formatISOStringHHMM, formatISOStringToFullDateString } from '@/lib/date';
import { deleteSessionMutationOptions } from '@/remotes/mutations/session';
import {
	getCurrentWeekSessionQuery,
	getSessionDetailQuery,
	getSessionListQuery,
} from '@/remotes/queries/session';

const SessionDetailInfoContainer = ({ sessionId }: { sessionId: string }) => {
	const {
		data: { data: sessionDetail },
	} = useSuspenseQuery(getSessionDetailQuery(Number(sessionId)));

	return (
		<div className="flex flex-col gap-y-5 px-4 md:px-0">
			<GAPageTracker type="session-detail" sessionId={sessionId} />
			<div className="flex items-center justify-between md:mt-6">
				<h3 className="font-semibold text-headline2 text-label-normal md:font-bold md:text-title1">
					{sessionDetail.name}
				</h3>
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild className="max-md:hidden">
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
								<Link href={`/session/${sessionDetail.id}/modify`}>
									<Pencil size={16} />
									수정
								</Link>
							</DropdownMenuItem>
							<div className="w-px bg-line-normal" />
							<DeleteSessionAlert sessionId={sessionDetail.id} />
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<SessionDetailInfoBox label="세션 정보">
				<p className="font-semibold text-body2 text-label-assistive">세션 주차</p>
				<p className="font-medium text-body2 text-label-subtle">{`${sessionDetail.week}주차`}</p>
				<p className="font-semibold text-body2 text-label-assistive">세션명</p>
				<p className="font-medium text-body2 text-label-subtle">{sessionDetail.name}</p>
				<p className="font-semibold text-body2 text-label-assistive">세션 날짜</p>
				<p className="font-medium text-body2 text-label-subtle">
					{formatISOStringToFullDateString(sessionDetail.date)}
				</p>
			</SessionDetailInfoBox>

			<SessionDetailInfoBox label="출석 코드">
				<p className="font-semibold text-body2 text-label-assistive leading-none">출석 코드</p>
				<div className="flex items-center justify-between">
					<p className="font-medium text-body2 text-label-subtle">{sessionDetail.attendanceCode}</p>
					<CopyButton value={sessionDetail.attendanceCode} />
				</div>
			</SessionDetailInfoBox>

			<SessionDetailInfoBox label="출석/지각 시간">
				<p className="font-semibold text-body2 text-label-assistive">출석 시간</p>
				<p className="font-medium text-body2 text-label-subtle">
					{formatISOStringHHMM(sessionDetail.attendanceStart)} -{' '}
					{formatISOStringHHMM(
						calcSessionAttendanceTime(sessionDetail.attendanceStart).toISOString(),
					)}
				</p>

				<p className="font-semibold text-body2 text-label-assistive">지각 시간</p>
				<p className="font-medium text-body2 text-label-subtle">
					{formatISOStringHHMM(sessionDetail.lateStart)} -{' '}
					{formatISOStringHHMM(sessionDetail.absentStart)}
				</p>
			</SessionDetailInfoBox>
		</div>
	);
};

interface SessionDetailInfoBoxProps {
	label: string;
	actions?: React.ReactNode;
}

const SessionDetailInfoBox = ({
	label,
	actions,
	children,
}: PropsWithChildren<SessionDetailInfoBoxProps>) => {
	return (
		<div className="flex flex-col">
			<div className="mb-2 flex items-center justify-between">
				<span className="font-semibold text-body1 text-label-subtle">{label}</span>
				{actions}
			</div>

			<div className="grid grid-cols-[70px_1fr] items-center gap-x-4 gap-y-3 rounded-lg bg-background-subtle px-5 py-3">
				{children}
			</div>
		</div>
	);
};

interface DeleteSessionAlertProps {
	sessionId: number;
}

const DeleteSessionAlert = ({ sessionId }: DeleteSessionAlertProps) => {
	const router = useRouter();

	const queryClient = useQueryClient();

	const { mutate: deleteSession, isPending: isDeleteSessionPending } = useMutation(
		deleteSessionMutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(getSessionListQuery);
				queryClient.invalidateQueries(getCurrentWeekSessionQuery);
				toast.success('세션 삭제에 성공했습니다.');
				router.replace('/session');
			},
			onError: () => {
				toast.error('세션 삭제에 실패했습니다.');
			},
		}),
	);

	const handleDeleteSession = () => {
		deleteSession({ sessionId });
	};

	const isDisabled = isDeleteSessionPending;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="none" size="none" className="gap-1.5">
					<Trash2 className="text-red-400" size={16} />
					삭제
				</Button>
			</DialogTrigger>
			<DialogContent showCloseButton={false} className="sm:max-w-[425px]">
				<DialogHeader className="text-left">
					<DialogTitle>정말 삭제하시겠어요?</DialogTitle>
					<DialogDescription>삭제 후에는 복구가 불가능합니다.</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex">
					<DialogClose asChild>
						<Button variant="assistive" size="lg" className="flex-1">
							취소
						</Button>
					</DialogClose>
					<Button
						variant="none"
						className="flex-1 bg-red-400 text-label-inverse"
						size="lg"
						disabled={isDisabled}
						onClick={handleDeleteSession}
					>
						삭제하기
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

const SessionDetailInfo = ErrorBoundary.with(
	{
		fallback: () => <ErrorBox />,
	},
	({ sessionId }: { sessionId: string }) => (
		<Suspense>
			<SessionDetailInfoContainer sessionId={sessionId} />
		</Suspense>
	),
);

export default SessionDetailInfo;
