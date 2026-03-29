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

import { useAfterPartyParticipantsFilterSearchParams } from '../_hooks/use-after-party-participants-filter-search-params';

interface AfterPartyParticipantsListProps {
	afterPartyId: number;
}

const AfterPartyParticipantsListContainer = (props: AfterPartyParticipantsListProps) => {
	const { afterPartyId } = props;
	const { afterPartyParticipantsStatus, afterPartyParticipantsIsMyTeam } =
		useAfterPartyParticipantsFilterSearchParams();

	const { user } = useAuth();

	const {
		data: { data: afterPartyParticipants },
	} = useSuspenseQuery(getAfterPartyInvitedMembersQueryOptions(afterPartyId));

	const filteredList = afterPartyParticipants.filter((member) => {
		const matchStatus =
			afterPartyParticipantsStatus === 'NO'
				? member.rsvpStatus === null
				: member.rsvpStatus !== null;
		const matchTeam = afterPartyParticipantsIsMyTeam
			? member.teamNumber === user?.teamNumber
			: true;
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
				itemContent={(_, member) => (
					<AfterPartyParticipantsItem key={member.memberId} {...member} />
				)}
			/>
		</ul>
	);
};

interface AfterPartyParticipantsItemProps {
	memberId: number;
	name: string;
	part: Part;
	teamNumber: number;
	rsvpStatus: boolean | null;
}

const AfterPartyParticipantsItem = (props: AfterPartyParticipantsItemProps) => {
	return (
		<li className="px-4 py-1.5">
			<Profile size={40} name={props.name} teamNumber={props.teamNumber} part={props.part} />
		</li>
	);
};

export const AfterPartyParticipantsList = (props: AfterPartyParticipantsListProps) => {
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
				<AfterPartyParticipantsListContainer {...props} />
			</Suspense>
		</ErrorBoundary>
	);
};
