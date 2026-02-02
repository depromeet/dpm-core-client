'use client';

import { CircleCheck, cn, toast } from '@dpm-core/shared';

import type { AttendanceStatus, StaffDinnerInfo as StaffDinnerInfoType } from '../_types/staff-dinner';
import { StaffDinnerEditBottomSheet } from './staff-dinner-edit-bottom-sheet';
import { StaffDinnerInfo } from './staff-dinner-info';
import { StaffDinnerSurveyHeader } from './staff-dinner-survey-header';

interface StaffDinnerViewProps {
  staffDinnerInfo: Omit<StaffDinnerInfoType, 'isClosed'>;
  attendance: AttendanceStatus;
  onAttendanceChange: (status: AttendanceStatus) => void;
  isClosed?: boolean;
}

export const StaffDinnerView = ({
  staffDinnerInfo,
  attendance,
  onAttendanceChange,
  isClosed = false,
}: StaffDinnerViewProps) => {
  const attendanceLabel = attendance === 'attending' ? '참석' : '불참';

  const handleEditSuccess = (newAttendance: AttendanceStatus) => {
    onAttendanceChange(newAttendance);
    toast.success('수정 완료했어요');
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* 헤더 영역 */}
      <StaffDinnerSurveyHeader />

      {/* 회식 정보 영역 */}
      <StaffDinnerInfo staffDinnerInfo={staffDinnerInfo} />

      <div className="h-[8px] bg-gray-100" />

      {/* 회식 참여 여부 영역 */}
      <section className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-body2 text-label-subtle">
            회식 참여 여부
          </div>
          <StaffDinnerEditBottomSheet
            attendance={attendance}
            onEditSuccess={handleEditSuccess}
            isClosed={isClosed}
          >
            <button
              type="button"
              className="font-medium text-body2 text-label-assistive"
            >
              수정하기
            </button>
          </StaffDinnerEditBottomSheet>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-lg border-none bg-background-subtle px-4 py-3">
          <CircleCheck size={16} />
          <span className="font-medium text-body2 text-label-normal">
            {attendanceLabel}
          </span>
        </div>

        <div
          className={cn(
            "mt-4 rounded-lg bg-background-subtle p-4",
            isClosed && "bg-red-50",
          )}
        >
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
                장소를 섭외하기 위해 필요한 정보에요. 당일 변동 시 운영진과 식당
                측이 어려움을 겪을 수 있어요.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
