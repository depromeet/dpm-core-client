'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';
import type { Part } from '@dpm-core/api';
import { Aesterisk } from '@dpm-core/shared';

import { Profile } from '@/components/attendance/profile';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/empty';
import { useAuth } from '@/providers/auth-provider';
import { getAfterPartyInvitedMembersQueryOptions } from '@/remotes/queries/after-party';

import { useAfterPartyParticipantsFilterSearchParams } from '../_hooks/use-after-party-participants-filter-search-params';

interface AfterPartyParticipantsListProps {
	afterPartyId: number;
}

export const AfterPartyParticipantsList = (props: AfterPartyParticipantsListProps) => {
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
		const matchTeam = afterPartyParticipantsIsMyTeam ? member.team === user?.teamNumber : true;
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
	team: number;
	rsvpStatus: boolean | null;
}

const AfterPartyParticipantsItem = (props: AfterPartyParticipantsItemProps) => {
	return (
		<li className="px-4 py-1.5">
			<Profile
				size={40}
				name={props.name}
				teamNumber={props.team}
				part={props.part === 'ETC' ? 'WEB' : props.part}
			/>
		</li>
	);
};
