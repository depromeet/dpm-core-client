import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { AttendanceStatus, SessionTargeted, SessionUnTargeted } from '@dpm-core/api';
import {
	ATTENDANCE_STATUS_MAP,
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	XCircle,
} from '@dpm-core/shared';

interface SessionAttendancePolicyModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	targeted: SessionTargeted[];
	untargeted: SessionUnTargeted[];
	isPending: boolean;
	onSubmit: () => void;
}

const formatAttendanceTime = (value: string) =>
	dayjs(value).locale('ko').format('YY년 MM월 DD일(ddd) HH:mm');

const AttendancePolicyStatusLabel = ({ status }: { status: AttendanceStatus }) => {
	const { icon, label } = ATTENDANCE_STATUS_MAP[status];

	return (
		<span className="flex h-5 items-center gap-0.5 whitespace-nowrap">
			<span className="[&>svg]:size-4">{icon}</span>
			<strong className="font-semibold text-body2 text-label-subtle">{label}</strong>
		</span>
	);
};

export const SessionAttendancePolicyModal = ({
	open,
	onOpenChange,
	targeted,
	untargeted,
	isPending,
	onSubmit,
}: SessionAttendancePolicyModalProps) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent
			className="w-[640px] max-w-[calc(100%-2rem)] gap-0 rounded-2xl p-8 sm:max-w-[640px]"
			showCloseButton={false}
		>
			<DialogHeader className="gap-3 text-left">
				<div className="flex items-center justify-between gap-4">
					<DialogTitle className="font-bold text-headline2 text-label-normal">
						출석 상태 변경
					</DialogTitle>
					<DialogClose asChild>
						<Button variant="none" size="none" className="size-6 shrink-0">
							<XCircle className="size-6 text-icon-normal" />
						</Button>
					</DialogClose>
				</div>
				<DialogDescription className="font-medium text-body2 text-label-assistive">
					수정된 출석/지각 시간에 따라 출석 상태가 자동으로 변경됩니다.
				</DialogDescription>
			</DialogHeader>

			<div className="flex flex-col gap-5 pt-6">
				<section className="flex flex-col gap-3">
					<h3 className="font-semibold text-body1 text-label-subtle">상태 변경 대상</h3>
					<ul className="flex flex-col gap-2 rounded-lg bg-background-subtle px-5 py-3">
						{targeted.map((member, index) => (
							<li
								key={`${member.name}-${member.attendedAt}-${index}`}
								className="grid grid-cols-[72px_140px_minmax(0,1fr)] items-center gap-3 text-body2 max-sm:grid-cols-[minmax(0,1fr)_auto]"
							>
								<span className="truncate font-medium text-label-normal">{member.name}</span>
								<span className="flex items-center gap-3 whitespace-nowrap">
									<AttendancePolicyStatusLabel status={member.currentStatus} />
									<svg
										aria-hidden="true"
										className="h-1 w-3 shrink-0 text-label-assistive"
										viewBox="0 0 12 4"
										fill="none"
									>
										<path
											d="M0.5 2H11.5M9.5 0.5L11.5 2"
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="1"
										/>
									</svg>
									<AttendancePolicyStatusLabel status={member.targetStatus} />
								</span>
								<span className="whitespace-nowrap text-right text-label-assistive max-sm:col-span-2">
									출석 시간: {formatAttendanceTime(member.attendedAt)}
								</span>
							</li>
						))}
					</ul>
				</section>

				{untargeted.length > 0 && (
					<section className="flex flex-col gap-3">
						<div className="flex flex-col gap-1">
							<h3 className="font-semibold text-body1 text-label-subtle">미적용 대상</h3>
							<p className="font-normal text-body2 text-label-assistive">
								출석 시간이 지난 후 운영진이 상태를 직접 변경한 경우, 자동 변경 대상에서 제외됩니다.
							</p>
						</div>
						<ul className="flex flex-col gap-2 rounded-lg bg-background-subtle px-5 py-3">
							{untargeted.map((member, index) => (
								<li
									key={`${member.name}-${member.updatedAt}-${index}`}
									className="grid grid-cols-[72px_140px_minmax(0,1fr)] items-center gap-3 text-body2 max-sm:grid-cols-[minmax(0,1fr)_auto]"
								>
									<span className="truncate font-medium text-label-normal">{member.name}</span>
									<AttendancePolicyStatusLabel status={member.status} />
									<span className="whitespace-nowrap text-right text-label-assistive max-sm:col-span-2">
										마지막 수정 시간: {formatAttendanceTime(member.updatedAt)}
									</span>
								</li>
							))}
						</ul>
					</section>
				)}
			</div>

			<DialogFooter className="pt-6">
				<Button
					variant="secondary"
					size="lg"
					className="h-12 w-full"
					disabled={isPending}
					loading={isPending}
					onClick={() => {
						onOpenChange(false);
						onSubmit();
					}}
				>
					저장
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
