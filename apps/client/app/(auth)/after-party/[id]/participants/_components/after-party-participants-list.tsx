'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';
import type { Part } from '@dpm-core/api';

import { Profile } from '@/components/attendance/profile';
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
			// isRsvpGoing가 null인 경우 미제출, 아닌 경우 제출, isRsvpGoing가 true인 경우 참석, false인 경우 불참
			afterPartyParticipantsStatus === 'NO'
				? member.isRsvpGoing === null
				: member.isRsvpGoing !== null;
		const matchTeam = afterPartyParticipantsIsMyTeam ? member.team === user?.teamNumber : true;
		return matchStatus && matchTeam;
	});

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
	isRsvpGoing: boolean;
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
