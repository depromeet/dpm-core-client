'use client';

import { useState } from 'react';

import { StaffDinnerAttendance } from './_components/staff-dinner-attendance';
import { StaffDinnerComplete } from './_components/staff-dinner-complete';
import { StaffDinnerInfo } from './_components/staff-dinner-info';
import { StaffDinnerSubmitButton } from './_components/staff-dinner-submit-button';
import { StaffDinnerSurveyHeader } from './_components/staff-dinner-survey-header';
import { StaffDinnerView } from './_components/staff-dinner-view';
import type { AttendanceStatus, PageState, StaffDinnerInfo as StaffDinnerInfoType } from './_types/staff-dinner';

const STAFF_DINNER_INFO: StaffDinnerInfoType = {
  id: 1,
  title: '17기 OT세션 공식 회식',
  description:
    '회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 회식설명 어쩌고 저쩌고 ',
  staffDinnerDate: '25년 00월 00일 (토)',
  dueDate: '25년 00월 00일 (토) 오전 00시',
  inviteVariation: ['17기 운영진', '17기 디퍼'],
  isClosed: false,
};

export default function Page() {
  const [attendance, setAttendance] =
    useState<AttendanceStatus>('not-attending');
  const [pageState, setPageState] = useState<PageState>('form');

  if (pageState === 'complete') {
    return <StaffDinnerComplete onGoToView={() => setPageState('view')} />;
  }

  if (pageState === 'view') {
    return (
      <StaffDinnerView
        staffDinnerInfo={STAFF_DINNER_INFO}
        attendance={attendance}
        onAttendanceChange={setAttendance}
        isClosed={STAFF_DINNER_INFO.isClosed}
      />
    );
  }
  return (
    <div className="flex min-h-screen flex-col">
      {/* 헤더 영역 */}
      <StaffDinnerSurveyHeader />
      {/* 회식 정보 영역 */}
      <StaffDinnerInfo staffDinnerInfo={STAFF_DINNER_INFO} />
      <div className="h-[8px] bg-gray-100" />
      {/*회식 참여 여부 영역*/}
      <StaffDinnerAttendance
        attendance={attendance}
        onAttendanceChange={setAttendance}
      />
      {/* 참석 여부 제출하기 버튼 영역 */}
      <StaffDinnerSubmitButton
        attendance={attendance}
        dinnerTitle={STAFF_DINNER_INFO.title}
        onSubmitSuccess={() => setPageState('complete')}
      />
    </div>
  );
}
