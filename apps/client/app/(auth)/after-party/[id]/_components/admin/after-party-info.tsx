import Link from 'next/link';
import { Button } from '@dpm-core/shared';

import { formatISOStringToDate } from '@/lib/date';

export interface AfterPartyInfoProps {
	gatheringId: number;
	title: string;
	isOwner: boolean;
	rsvpStatus: boolean | null;
	isAttended: boolean | null;
	description: string;
	scheduledAt: string;
	isRsvpGoingCount: number;
	inviteeCount: number;
	attendanceCount: number;
	createdAt: string;
	closedAt: string;
	inviteTags: { inviteTags: InviteTag[] };
}

export interface InviteTag {
	cohortId: number;
	authorityId: number;
	tagName: string;
}

export const AfterPartyInfo = (props: AfterPartyInfoProps) => {
	const { title, description, scheduledAt, closedAt, inviteTags, gatheringId, isOwner } = props;

	return (
		<section className="p-4">
			<div className="flex flex-col gap-5">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-headline2 text-label-normal">{title}</h2>
					{isOwner && (
						<Button size="md" variant="text" className="h-10 px-4" asChild>
							<Link href={`/after-party/${gatheringId}/update`}>수정하기</Link>
						</Button>
					)}
				</div>

				<p className="font-medium text-body2 text-label-assistive">{description}</p>
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-4 text-body2">
						<p className="w-17.5 shrink-0 font-semibold text-label-assistive">회식 날짜</p>
						<p className="font-medium text-label-subtle">{formatISOStringToDate(scheduledAt)}</p>
					</div>
					<div className="flex items-center gap-4 text-body2">
						<p className="w-17.5 shrink-0 font-semibold text-label-assistive">조사 기한</p>
						<p className="font-medium text-label-subtle">{formatISOStringToDate(closedAt)}</p>
					</div>
					<div className="flex items-center gap-4 text-body2">
						<p className="w-17.5 shrink-0 font-semibold text-label-assistive">초대 범위</p>
						<div className="flex flex-wrap gap-1">
							{inviteTags.inviteTags.map((inviteAuthority, index) => {
								return (
									<div
										key={`invite-authority-${inviteAuthority.authorityId}-${index}`}
										className="rounded-sm bg-gray-100 px-1.5 py-1 font-semibold text-caption1 text-gray-500"
									>
										<span className="mr-0.5">@</span>
										<span>{inviteAuthority.tagName}</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
