'use client';

import { Suspense } from 'react';
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';
import type { Part } from '@dpm-core/api';
import { Aesterisk } from '@dpm-core/shared';

import { Profile } from '@/components/attendance/profile';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/empty';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { useAuth } from '@/providers/auth-provider';
import { getAfterPartyInvitedMembersQueryOptions } from '@/remotes/queries/after-party';

import { useAfterPartyAttendeesFilterSearchParams } from '../_hooks/use-after-party-attendees-filter-search-params';

interface AfterPartyAttendeesListProps {
	afterPartyId: number;
}

const AfterPartyAttendeesListContainer = (props: AfterPartyAttendeesListProps) => {
	const { afterPartyId } = props;
	const { afterPartyAttendeesStatus, afterPartyAttendeesIsMyTeam } =
		useAfterPartyAttendeesFilterSearchParams();

	const { user } = useAuth();

	const {
		data: { data: afterPartyAttendees },
	} = useSuspenseQuery(getAfterPartyInvitedMembersQueryOptions(afterPartyId));

	const filteredList = afterPartyAttendees.filter((member) => {
		const { rsvpStatus, team } = member;

		if (rsvpStatus == null) return false;
		const matchStatus = rsvpStatus === (afterPartyAttendeesStatus === 'YES');
		const matchTeam = !afterPartyAttendeesIsMyTeam || team === user?.teamNumber;

		return matchStatus && matchTeam;
	});

	if (filteredList.length === 0) {
		return (
			<Empty className="h-full min-h-41.5">
				<EmptyHeader>
					<Aesterisk />
					<EmptyTitle>해당하는 멤버가 없어요</EmptyTitle>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<ul className="h-full py-3">
			<Virtuoso
				className="scrollbar-hide"
				data={filteredList}
				itemContent={(_, member) => <AfterPartyAttendeesItem key={member.memberId} {...member} />}
			/>
		</ul>
	);
};

interface AfterPartyAttendeesItemProps {
	memberId: number;
	name: string;
	part: Part;
	team: number;
	rsvpStatus: boolean | null;
}

const AfterPartyAttendeesItem = (props: AfterPartyAttendeesItemProps) => {
	return (
		<li className="px-4 py-1.5">
			<Profile size={40} name={props.name} teamNumber={props.team} part={props.part} />
		</li>
	);
};

export const AfterPartyAttendeesList = (props: AfterPartyAttendeesListProps) => {
	return (
		<ErrorBoundary
			fallback={(props: ErrorBoundaryFallbackProps) => <ErrorBox onReset={() => props.reset()} />}
		>
			<Suspense
				fallback={
					<div className="flex h-full flex-col">
						<LoadingBox />
					</div>
				}
			>
				<AfterPartyAttendeesListContainer {...props} />
			</Suspense>
		</ErrorBoundary>
	);
};
