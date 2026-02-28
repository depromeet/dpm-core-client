'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';
import type { Part } from '@dpm-core/api';

import { Profile } from '@/components/attendance/profile';
import { useAuth } from '@/providers/auth-provider';
import { getAfterPartyInvitedMembersQueryOptions } from '@/remotes/queries/after-party';

import { useAfterPartyAttendeesFilterSearchParams } from '../_hooks/use-after-party-attendees-filter-search-params';

interface AfterPartyAttendeesListProps {
	afterPartyId: number;
}

export const AfterPartyAttendeesList = (props: AfterPartyAttendeesListProps) => {
	const { afterPartyId } = props;
	const { afterPartyAttendeesStatus, afterPartyAttendeesIsMyTeam } =
		useAfterPartyAttendeesFilterSearchParams();

	const { user } = useAuth();

	const {
		data: { data: afterPartyAttendees },
	} = useSuspenseQuery(getAfterPartyInvitedMembersQueryOptions(afterPartyId));

	const filteredList = afterPartyAttendees.filter((member) => {
		const matchStatus =
			afterPartyAttendeesStatus === 'NO' ? !member.isRsvpGoing : member.isRsvpGoing;
		const matchTeam = afterPartyAttendeesIsMyTeam ? member.team === user?.teamNumber : true;
		return matchStatus && matchTeam;
	});

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
	isRsvpGoing: boolean;
}

const AfterPartyAttendeesItem = (props: AfterPartyAttendeesItemProps) => {
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
