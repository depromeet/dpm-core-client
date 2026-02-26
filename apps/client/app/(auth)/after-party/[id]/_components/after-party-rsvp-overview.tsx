'use client';

import { useRouter } from 'next/navigation';
import { Button, Progress } from '@dpm-core/shared';

import { NonParticipantsNotification } from './non-participants-notification';

interface AfterPartyRsvpOverviewProps {
	attendanceCount: number;
	isRsvpGoingCount: number;
	inviteeCount: number;
}

export const AfterPartyRsvpOverview = (props: AfterPartyRsvpOverviewProps) => {
	const { attendanceCount, isRsvpGoingCount, inviteeCount } = props;

	const router = useRouter();
	const handleGoToParticipants = () => {
		router.push(`/after-party/1/participants`);
	};
	const handleGoToAttendees = () => {
		router.push(`/after-party/1/attendees`);
	};

	return (
		<section className="mb-20 px-4 py-5">
			<div className="mb-5 flex flex-col items-center gap-3 rounded-xl border border-line-normal p-5">
				<div className="flex flex-col items-center gap-1">
					<p className="font-semibold text-body2 text-label-assistive">회식 참여 인원</p>
					<strong className="font-bold text-headline1 text-label-strong">
						{attendanceCount}명
					</strong>
				</div>
				<Button size="md" variant="assistive" className="w-full" onClick={handleGoToAttendees}>
					참석자 보기
				</Button>
			</div>
			<div className="flex flex-col items-center gap-3 rounded-xl border border-line-normal p-5">
				<p className="font-semibold text-body2 text-label-assistive">사전 조사 참여율</p>
				<div className="mt-4 mb-2.5 flex w-full flex-col gap-2">
					<Progress value={Math.round((isRsvpGoingCount / inviteeCount) * 100)} className="h-2.5" />
					<p className="font-semibold text-caption1">
						<strong className="text-label-subtle">{isRsvpGoingCount}</strong>
						<span className="text-label-assistive">/{inviteeCount}명 참여</span>
					</p>
				</div>
				<Button size="md" variant="assistive" className="w-full" onClick={handleGoToParticipants}>
					제출자 현황 보기
				</Button>
				<NonParticipantsNotification size="md" />
			</div>
		</section>
	);
};
