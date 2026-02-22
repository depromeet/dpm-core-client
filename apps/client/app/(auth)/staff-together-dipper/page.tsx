'use client';

import { useState } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';

import { getGatheringV2DetailQueryOptions } from '@/remotes/queries/gathering-v2';

import { StaffDinnerAttendance } from './_components/staff-dinner-attendance';
import { StaffDinnerComplete } from './_components/staff-dinner-complete';
import { StaffDinnerInfo } from './_components/staff-dinner-info';
import { StaffDinnerSubmitButton } from './_components/staff-dinner-submit-button';
import { StaffDinnerSurveyHeader } from './_components/staff-dinner-survey-header';
import { StaffDinnerView } from './_components/staff-dinner-view';
import type { AttendanceStatus, PageState } from './_types/staff-dinner';
import { fromRsvpStatus } from './_types/staff-dinner';

export default function Page() {
	const searchParams = useSearchParams();
	const gatheringId = Number(searchParams.get('gatheringId'));
	const queryClient = useQueryClient();

	if (!gatheringId) {
		redirect('/');
	}

	const { data: gatheringDetail } = useSuspenseQuery(
		getGatheringV2DetailQueryOptions(gatheringId),
	);
	const detail = gatheringDetail.data;

	const isClosed = new Date(detail.closedAt) < new Date();
	const initialAttendance = fromRsvpStatus(detail.rsvpStatus);
	const initialPageState: PageState = detail.rsvpStatus !== null ? 'view' : 'form';

	const [attendance, setAttendance] = useState<AttendanceStatus>(initialAttendance);
	const [pageState, setPageState] = useState<PageState>(initialPageState);

	const handleSubmitSuccess = () => {
		queryClient.invalidateQueries(getGatheringV2DetailQueryOptions(gatheringId));
		setPageState('complete');
	};

	if (pageState === 'complete') {
		return <StaffDinnerComplete onGoToView={() => setPageState('view')} />;
	}

	if (pageState === 'view') {
		return (
			<StaffDinnerView
				staffDinnerInfo={detail}
				attendance={attendance}
				onAttendanceChange={setAttendance}
				isClosed={isClosed}
				gatheringId={gatheringId}
			/>
		);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<StaffDinnerSurveyHeader />
			<StaffDinnerInfo staffDinnerInfo={detail} />
			<div className="h-[8px] bg-gray-100" />
			<StaffDinnerAttendance attendance={attendance} onAttendanceChange={setAttendance} />
			<StaffDinnerSubmitButton
				attendance={attendance}
				dinnerTitle={detail.title}
				gatheringId={gatheringId}
				onSubmitSuccess={handleSubmitSuccess}
			/>
		</div>
	);
}
