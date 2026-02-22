'use client';

import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { GatheringV2RsvpMember } from '@dpm-core/api';
import {
	Checkbox,
	Label,
	MemberProfile,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@dpm-core/shared';

import { useAuth } from '@/providers/auth-provider';
import { getGatheringV2RsvpMembersQueryOptions } from '@/remotes/queries/gathering-v2';

const PART_LABEL: Record<string, string> = {
	WEB: '웹',
	ANDROID: '안드로이드',
	IOS: 'iOS',
	DESIGN: '디자인',
	SERVER: '서버',
	ETC: '기타',
};

interface RsvpMemberListProps {
	gatheringId: number;
}

export const RsvpMemberList = ({ gatheringId }: RsvpMemberListProps) => {
	const { user } = useAuth();
	const [myTeamOnly, setMyTeamOnly] = useState(false);

	const { data: rsvpMembersData } = useSuspenseQuery(
		getGatheringV2RsvpMembersQueryOptions(gatheringId),
	);
	const members = rsvpMembersData.data;

	const filterMembers = (isGoing: boolean) => {
		let filtered = members.filter((m) => m.isRsvpGoing === isGoing);
		if (myTeamOnly && user?.teamNumber) {
			filtered = filtered.filter((m) => m.team === user.teamNumber);
		}
		return filtered;
	};

	const attendingMembers = filterMembers(true);
	const notAttendingMembers = filterMembers(false);

	return (
		<section className="flex flex-1 flex-col px-4 pt-4">
			<Tabs defaultValue="attending">
				<div className="flex items-center justify-between">
					<TabsList className="w-auto">
						<TabsTrigger value="attending" className="px-3">
							참석
						</TabsTrigger>
						<TabsTrigger value="not-attending" className="px-3">
							불참
						</TabsTrigger>
					</TabsList>
					<div className="flex items-center gap-1.5">
						<Checkbox
							id="my-team-only"
							checked={myTeamOnly}
							onCheckedChange={(checked) => setMyTeamOnly(checked === true)}
						/>
						<Label
							htmlFor="my-team-only"
							className="cursor-pointer text-caption1 text-label-assistive"
						>
							내 팀만 보기
						</Label>
					</div>
				</div>

				<TabsContent value="attending">
					<MemberListContent members={attendingMembers} />
				</TabsContent>
				<TabsContent value="not-attending">
					<MemberListContent members={notAttendingMembers} />
				</TabsContent>
			</Tabs>
		</section>
	);
};

const MemberListContent = ({ members }: { members: GatheringV2RsvpMember[] }) => {
	if (members.length === 0) {
		return (
			<div className="flex items-center justify-center py-10">
				<p className="text-body2 text-label-assistive">해당하는 멤버가 없어요</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			{members.map((member) => (
				<MemberProfile
					key={member.memberId}
					name={member.name}
					team={`${member.team}팀`}
					role={PART_LABEL[member.part] ?? member.part}
				/>
			))}
		</div>
	);
};
