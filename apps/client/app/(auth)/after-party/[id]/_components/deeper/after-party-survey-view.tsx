'use client';

import { Suspense } from 'react';
import { Loader2Icon } from 'lucide-react';
import type { AfterPartyDetail } from '@dpm-core/api';
import { CircleCheck, cn, toast } from '@dpm-core/shared';

import type { AttendanceStatus } from '../../_types/after-party-survey';
import { AfterPartyEditBottomSheet } from './after-party-edit-bottom-sheet';
import { AfterPartyInfo } from './after-party-info';
import { AfterPartySurveyHeader } from './after-party-survey-header';
import { InvitedMemberList } from './invited-member-list';

interface AfterPartySurveyViewProps {
	afterPartyDetail: AfterPartyDetail;
	attendance: AttendanceStatus;
	onAttendanceChange: (status: AttendanceStatus) => void;
	isClosed: boolean;
	gatheringId: number;
}

export const AfterPartySurveyView = ({
	afterPartyDetail,
	attendance,
	onAttendanceChange,
	isClosed,
	gatheringId,
}: AfterPartySurveyViewProps) => {
	const attendanceLabel = attendance === 'attending' ? '참석' : '불참';

	const handleEditSuccess = (newAttendance: AttendanceStatus) => {
		onAttendanceChange(newAttendance);
		toast.success('수정 완료했어요');
	};

	return (
		<div className="flex min-h-screen flex-col">
			<AfterPartySurveyHeader />

			<AfterPartyInfo afterPartyDetail={afterPartyDetail} />

			<div className="h-2 bg-gray-100" />

			<section className="px-4 py-4">
				<div className="flex items-center justify-between">
					<div className="font-semibold text-body2 text-label-subtle">회식 참여 여부</div>
					<AfterPartyEditBottomSheet
						attendance={attendance}
						onEditSuccess={handleEditSuccess}
						isClosed={isClosed}
						gatheringId={gatheringId}
					>
						<button type="button" className="font-medium text-body2 text-label-assistive">
							수정하기
						</button>
					</AfterPartyEditBottomSheet>
				</div>

				<div className="mt-3 flex items-center gap-2 rounded-lg border-none bg-background-subtle px-4 py-3">
					<CircleCheck size={16} />
					<span className="font-medium text-body2 text-label-normal">{attendanceLabel}</span>
				</div>

				<div className={cn('mt-4 rounded-lg bg-background-subtle p-4', isClosed && 'bg-red-50')}>
					{isClosed ? (
						<>
							<p className="font-semibold text-body2 text-label-normal">
								참여 여부 조사가 마감됐어요.
							</p>
							<p className="mt-1 text-caption1 text-label-assistive">
								마감 후 수정은 식당 예약에 영향을 줄 수 있어요.
							</p>
						</>
					) : (
						<>
							<p className="font-semibold text-body2 text-label-normal">
								참석 여부가 바뀌면 꼭 수정해주세요.
							</p>
							<p className="mt-1 text-caption1 text-label-assistive">
								장소를 섭외하기 위해 필요한 정보에요. 당일 변동 시 운영진과 식당 측이 어려움을 겪을
								수 있어요.
							</p>
						</>
					)}
				</div>
			</section>

			<div className="h-2 bg-gray-100" />

			<Suspense
				fallback={
					<div className="flex items-center justify-center py-10">
						<Loader2Icon className="animate-spin text-label-assistive" size={24} />
					</div>
				}
			>
				<InvitedMemberList gatheringId={gatheringId} isClosed={isClosed} />
			</Suspense>
		</div>
	);
};
