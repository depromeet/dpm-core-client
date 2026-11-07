'use client';

import { type ComponentProps, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import type { AbsenceReasonStatus } from '@dpm-core/api';
import { Badge, Button } from '@dpm-core/shared';

import { toast } from '@/lib/toast';
import { reviewAbsenceReasonOptions } from '@/remotes/mutations/attendance';
import { ATTENDANCE_QUERY_KEY } from '@/remotes/queries/attendance';

interface AbsenceReasonReviewProps {
	sessionId: number;
	memberId: number;
	status: AbsenceReasonStatus;
	disabled: boolean;
}

const STATUS_LABEL: Record<AbsenceReasonStatus, string> = {
	PENDING: '검토 대기',
	APPROVED: '승인 완료',
	REJECTED: '반려',
};

const STATUS_BADGE_VARIANT: Record<AbsenceReasonStatus, ComponentProps<typeof Badge>['variant']> = {
	PENDING: 'IMPOSSIBLE',
	APPROVED: 'NORMAL',
	REJECTED: 'AT_RISK',
};

interface AbsenceReasonStatusBadgeProps {
	status: AbsenceReasonStatus;
}

export function AbsenceReasonStatusBadge({ status }: AbsenceReasonStatusBadgeProps) {
	return <Badge variant={STATUS_BADGE_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}

export function AbsenceReasonReview({
	sessionId,
	memberId,
	status,
	disabled,
}: AbsenceReasonReviewProps) {
	const queryClient = useQueryClient();
	const [refreshFailed, setRefreshFailed] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const refresh = async () => {
		setIsRefreshing(true);
		try {
			await queryClient.invalidateQueries(
				{ queryKey: [ATTENDANCE_QUERY_KEY] },
				{ throwOnError: true },
			);
			setRefreshFailed(false);
		} catch {
			setRefreshFailed(true);
		} finally {
			setIsRefreshing(false);
		}
	};

	const { mutate, isPending } = useMutation({
		...reviewAbsenceReasonOptions(sessionId, memberId),
		onSuccess: async (_, { approved }) => {
			toast.success(approved ? '결석 사유서를 승인했어요.' : '결석 사유서를 반려했어요.');
			await refresh();
		},
		onError: async (error) => {
			toast.error('결석 사유서 검토에 실패했어요. 다시 시도해 주세요.');
			const isConflict = error instanceof HTTPError && error.response.status === 409;
			if (isConflict) {
				await refresh();
			}
		},
	});

	const canReview = status === 'PENDING' && !refreshFailed;
	const isDisabled = disabled || isPending || isRefreshing;
	const hasReviewContent = canReview || refreshFailed;

	if (!hasReviewContent) return null;

	return (
		<div className="mt-3 space-y-2">
			{canReview ? (
				<div className="flex gap-2">
					<Button
						type="button"
						variant="secondary"
						size="sm"
						disabled={isDisabled}
						onClick={() => mutate({ approved: true })}
					>
						{isPending ? '처리 중' : '승인'}
					</Button>
					<Button
						type="button"
						variant="assistive"
						size="sm"
						disabled={isDisabled}
						onClick={() => mutate({ approved: false })}
					>
						반려
					</Button>
				</div>
			) : null}
			{refreshFailed ? (
				<div className="space-y-2">
					<p className="text-body2 text-label-assistive">검토 결과를 불러오지 못했어요.</p>
					<Button
						type="button"
						variant="assistive"
						size="sm"
						disabled={isRefreshing}
						onClick={refresh}
					>
						다시 시도
					</Button>
				</div>
			) : null}
		</div>
	);
}
