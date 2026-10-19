import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type { SessionAttendanceStatusTime } from '@dpm-core/api';
import { Button, toast } from '@dpm-core/shared';

import { modifySessionMutationOptions } from '@/remotes/mutations/session';
import { ATTENDANCE_QUERY_KEY } from '@/remotes/queries/attendance';
import {
	getCurrentWeekSessionQuery,
	getSessionDetailQuery,
	getSessionListQuery,
	getSessionModifyPolicyQuery,
} from '@/remotes/queries/session';

import { SessionSaveConfirmModal } from '../../../_components/SessionSaveConfirmModal';
import { buildSessionPayload, type SessionSchema } from '../../../create/_components/SessionForm';
import { SessionAttendancePolicyModal } from './SessionAttendancePolicyModal';

interface SessionModifyConfirmModalProps {
	sessionId: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	formData: SessionSchema;
	initialAttendanceTimes: SessionAttendanceStatusTime;
}

export const SessionModifyConfirmModal = ({
	formData,
	sessionId,
	open,
	onOpenChange,
	initialAttendanceTimes,
}: SessionModifyConfirmModalProps) => {
	const queryClient = useQueryClient();
	const router = useRouter();
	const payload = buildSessionPayload(formData);
	const initialAttendanceStart = dayjs(initialAttendanceTimes.attendanceStart).format(
		'YYYY-MM-DDTHH:mm:ss',
	);
	const initialLateStart = dayjs(initialAttendanceTimes.lateStart).format('YYYY-MM-DDTHH:mm:ss');
	const initialAbsentStart = dayjs(initialAttendanceTimes.absentStart).format(
		'YYYY-MM-DDTHH:mm:ss',
	);
	const attendanceTimesChanged =
		payload.attendanceStart !== initialAttendanceStart ||
		payload.lateStart !== initialLateStart ||
		payload.absentStart !== initialAbsentStart;
	const policyQuery = useQuery({
		...getSessionModifyPolicyQuery({
			sessionId,
			attendanceStart: payload.attendanceStart,
			lateStart: payload.lateStart,
			absentStart: payload.absentStart,
		}),
		enabled: open && attendanceTimesChanged,
	});
	const policy = policyQuery.data?.data;

	const { mutate: modifySession, isPending } = useMutation(
		modifySessionMutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(getSessionListQuery);
				queryClient.invalidateQueries(getCurrentWeekSessionQuery);
				queryClient.invalidateQueries(getSessionDetailQuery(sessionId));
				queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY] });
				toast.success('세션을 수정했습니다.');
				onOpenChange(false);
				router.replace('/session');
			},
			onError: () => {
				toast.error('세션 수정에 실패했습니다.');
			},
		}),
	);

	const handleModifySession = () => {
		modifySession({
			sessionId,
			...payload,
		});
	};

	const needsPolicyCheck = attendanceTimesChanged;
	const hasTargetedAttendanceChanges = needsPolicyCheck && (policy?.targeted.length ?? 0) > 0;
	const policyCheckContent = policyQuery.isPending ? (
		<p className="py-6 text-center font-medium text-body2 text-label-assistive">
			출석 상태 변경 대상을 확인하고 있어요.
		</p>
	) : policyQuery.isError ? (
		<div className="flex flex-col items-center gap-3 py-6">
			<p className="font-medium text-body2 text-label-assistive">
				출석 상태 변경 대상을 확인하지 못했어요.
			</p>
			<Button variant="secondary" size="sm" onClick={() => void policyQuery.refetch()}>
				다시 시도
			</Button>
		</div>
	) : null;

	return hasTargetedAttendanceChanges && policy ? (
		<SessionAttendancePolicyModal
			open={open}
			onOpenChange={onOpenChange}
			targeted={policy.targeted}
			untargeted={policy.untargeted}
			isPending={isPending}
			onSubmit={handleModifySession}
		/>
	) : (
		<SessionSaveConfirmModal
			open={open}
			onOpenChange={onOpenChange}
			onSubmit={handleModifySession}
			title="세션 정보를 수정할까요?"
			isPending={isPending}
			isConfirmDisabled={
				needsPolicyCheck && (policyQuery.isPending || policyQuery.isFetching || policyQuery.isError)
			}
			content={needsPolicyCheck ? policyCheckContent : null}
		/>
	);
};
