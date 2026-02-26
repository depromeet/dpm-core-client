'use client';

import { redirect, useParams } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { getAfterPartyByIdQueryOptions } from '@/remotes/queries/after-party';

import {
	type AttendanceStatus,
	fromAttendanceResponse,
	type PageState,
} from '../../_types/after-party-survey';
import { AfterPartyAttendance } from './after-party-attendance';
import { AfterPartyInfo } from './after-party-info';
import { AfterPartySubmitButton } from './after-party-submit-button';
import { AfterPartySurveyComplete } from './after-party-survey-complete';
import { AfterPartySurveyHeader } from './after-party-survey-header';
import { AfterPartySurveyView } from './after-party-survey-view';

export function DeeperAfterPartyDetail() {
	const params = useParams<{ id: string }>();
	const { id: gatheringId } = params;
	const queryClient = useQueryClient();

	if (!gatheringId) {
		redirect('/');
	}

	const { data: afterPartyDetail } = useSuspenseQuery(
		getAfterPartyByIdQueryOptions(Number(gatheringId)),
	);
	const detail = afterPartyDetail.data;

	const isClosed = new Date(detail.closedAt) < new Date();
	const initialAttendance = fromAttendanceResponse(detail.rsvpStatus);
	const initialPageState: PageState = detail.rsvpStatus !== null ? 'view' : 'form';

	const [attendance, setAttendance] = useState<AttendanceStatus>(initialAttendance);
	const [pageState, setPageState] = useState<PageState>(initialPageState);

	const handleSubmitSuccess = () => {
		queryClient.invalidateQueries(getAfterPartyByIdQueryOptions(Number(gatheringId)));
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
				gatheringId={Number(gatheringId)}
			/>
		);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<AfterPartySurveyHeader />
			<AfterPartyInfo afterPartyDetail={detail} />
			<div className="h-2 bg-gray-100" />
			<AfterPartyAttendance attendance={attendance} onAttendanceChange={setAttendance} />
			<AfterPartySubmitButton
				attendance={attendance}
				afterPartyTitle={detail.title}
				gatheringId={Number(gatheringId)}
				onSubmitSuccess={handleSubmitSuccess}
			/>
		</div>
	);
}
