import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	toast,
} from '@dpm-core/shared';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { formatISOStringToFullDateString } from '@/lib/date';
import { modifySessionMutationOptions } from '@/remotes/mutations/session';
import {
	getCurrentWeekSessionQuery,
	getSessionDetailQuery,
	getSessionListQuery,
	getSessionModifyPolicyQuery,
} from '@/remotes/queries/session';

import {
	buildServerDatePayload,
	type SessionSchema,
} from '../../../create/_components/SessionForm';
import { SessionModifyConfirmModal } from './SessionModifyConfirmModal';

interface SessionPolicyModalProps {
	sessionId: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	formData: SessionSchema;
}

export const SessionPolicyModal = (props: SessionPolicyModalProps) => {
	const { formData, sessionId, open, onOpenChange } = props;

	const queryClient = useQueryClient();

	const { attendanceStart, lateStart, absentStart } = buildServerDatePayload(formData);

	const {
		data: { data: SessionModifyPreview },
	} = useSuspenseQuery(
		getSessionModifyPolicyQuery({
			sessionId,
			attendanceStart,
			lateStart,
			absentStart,
		}),
	);

	const { mutate: modifySession, isPending } = useMutation(
		modifySessionMutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(getSessionListQuery);
				queryClient.invalidateQueries(getCurrentWeekSessionQuery);
				queryClient.invalidateQueries(getSessionDetailQuery(sessionId));
				toast.success('세션을 수정했습니다.');
				onOpenChange(false);
			},
			onError: () => {
				toast.error('세션 수정에 실패했습니다.');
			},
		}),
	);

	const handleModifySession = () => {
		const payload = {
			sessionId,
			...buildServerDatePayload(formData),
		};
		modifySession(payload);
	};

	if (SessionModifyPreview.targeted.length > 0 && SessionModifyPreview.untargeted.length > 0) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[640px]">
					<DialogHeader className="text-left">
						<DialogTitle>출석 상태 변경</DialogTitle>
						<DialogDescription>
							수정된 출석/ 지각 시간에 따라 출석 상태가 자동으로 변경됩니다.
						</DialogDescription>
					</DialogHeader>

					<div className="my-6 flex flex-col gap-6">
						<div className="flex flex-col gap-2">
							<p className="font-semibold text-body1 text-label-subtle">상태 변경 대상</p>
							<ul className="flex max-h-[240px] flex-col gap-3 overflow-auto rounded-lg bg-background-subtle px-5 py-3 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2">
								{SessionModifyPreview.targeted.map((member, index) => {
									return (
										<li className="flex justify-between" key={`${member.name}-${index}`}>
											<div className="flex items-center gap-4">
												<span className="w-[70px] font-semibold text-body2">{member.name}</span>
												<div className="flex items-center gap-3">
													<AttendanceStatusLabel status={member.currentStatus} />
													<svg width="12" height="4" viewBox="0 0 12 4" fill="none">
														<title>right-icon</title>
														<path
															d="M12 4H0V2.95082H9.68152L7.71451 0.672131L8.54663 0L12 4Z"
															fill="#9CA3AF"
														/>
													</svg>
													<AttendanceStatusLabel status={member.targetStatus} />
												</div>
											</div>
											<div className="font-medium text-body2 text-label-assistive">
												<span>출석 시간: </span>
												<time>{formatISOStringToFullDateString(member.attendedAt)}</time>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
						<div className="flex flex-col gap-2">
							<p className="font-semibold text-body1 text-label-subtle">미적용 대상</p>
							<p className="font-medium text-body2 text-label-assistive">
								출석 시간이 지난 후 운영진이 상태를 직접 변경한 경우, 자동 변경 대상에서 제외됩니다.
							</p>
							<ul className="flex max-h-[240px] flex-col gap-3 overflow-auto rounded-lg bg-background-subtle px-5 py-3 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2">
								{SessionModifyPreview.untargeted.map((member, index) => {
									return (
										<li className="flex justify-between" key={`${member.name}-${index}`}>
											<div className="flex items-center gap-4">
												<span className="w-[70px] font-semibold text-body2">{member.name}</span>
												<div className="flex items-center gap-3">
													<AttendanceStatusLabel status={member.status} />
												</div>
											</div>
											<div className="font-medium text-body2 text-label-assistive">
												<span>마지막 출석 시간: </span>
												<time>{formatISOStringToFullDateString(member.updatedAt)}</time>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="secondary"
							size="lg"
							className="w-full"
							disabled={isPending}
							onClick={handleModifySession}
						>
							저장
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<SessionModifyConfirmModal
			open={open}
			onOpenChange={onOpenChange}
			onSubmit={handleModifySession}
		/>
	);
};
