'use client';

import { useState } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';

import { getAfterPartyDetailQueryOptions } from '@/remotes/queries/after-party';

import { AfterPartyAttendance } from './_components/after-party-attendance';
import { AfterPartySurveyComplete } from './_components/after-party-survey-complete';
import { AfterPartyInfo } from './_components/after-party-info';
import { AfterPartySubmitButton } from './_components/after-party-submit-button';
import { AfterPartySurveyHeader } from './_components/after-party-survey-header';
import { AfterPartySurveyView } from './_components/after-party-survey-view';
import type { AttendanceStatus, PageState } from './_types/after-party-survey';
import { fromAttendanceResponse } from './_types/after-party-survey';

export default function Page() {
	const searchParams = useSearchParams();
	const gatheringId = Number(searchParams.get('gatheringId'));
	const queryClient = useQueryClient();

	if (!gatheringId) {
		redirect('/');
	}

	const { data: afterPartyDetail } = useSuspenseQuery(getAfterPartyDetailQueryOptions(gatheringId));
	const detail = afterPartyDetail.data;

	const isClosed = new Date(detail.closedAt) < new Date();
	const initialAttendance = fromAttendanceResponse(detail.rsvpStatus);
	const initialPageState: PageState = detail.rsvpStatus !== null ? 'view' : 'form';

	const [attendance, setAttendance] = useState<AttendanceStatus>(initialAttendance);
	const [pageState, setPageState] = useState<PageState>(initialPageState);

	const handleSubmitSuccess = () => {
		queryClient.invalidateQueries(getAfterPartyDetailQueryOptions(gatheringId));
		setPageState('complete');
	};

	if (pageState === 'complete') {
		return <AfterPartySurveyComplete onGoToView={() => setPageState('view')} />;
	}

	if (pageState === 'view') {
		return (
			<AfterPartySurveyView
				afterPartyDetail={detail}
				attendance={attendance}
				onAttendanceChange={setAttendance}
				isClosed={isClosed}
				gatheringId={gatheringId}
			/>
		);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<AfterPartySurveyHeader />
			<AfterPartyInfo afterPartyDetail={detail} />
			<div className="h-[8px] bg-gray-100" />
			<AfterPartyAttendance attendance={attendance} onAttendanceChange={setAttendance} />
			<AfterPartySubmitButton
				attendance={attendance}
				afterPartyTitle={detail.title}
				gatheringId={gatheringId}
				onSubmitSuccess={handleSubmitSuccess}
			/>
		</div>
	);
}
