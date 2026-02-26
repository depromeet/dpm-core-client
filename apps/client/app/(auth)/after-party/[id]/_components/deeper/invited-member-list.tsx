'use client';

import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { AfterPartyInvitedMember } from '@dpm-core/api';
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
import { getAfterPartyInvitedMembersQueryOptions } from '@/remotes/queries/after-party';

const PART_LABEL: Record<string, string> = {
	WEB: '웹',
	ANDROID: '안드로이드',
	IOS: 'iOS',
	DESIGN: '디자인',
	SERVER: '서버',
	ETC: '기타',
};

interface InvitedMemberListProps {
	gatheringId: number;
	isClosed: boolean;
}

export const InvitedMemberList = ({ gatheringId, isClosed }: InvitedMemberListProps) => {
	const { user } = useAuth();
	const [myTeamOnly, setMyTeamOnly] = useState(false);

	const { data: invitedMembersData } = useSuspenseQuery(
		getAfterPartyInvitedMembersQueryOptions(gatheringId),
	);
	const members = invitedMembersData.data;

	const applyTeamFilter = (list: AfterPartyInvitedMember[]) => {
		if (myTeamOnly && user?.teamNumber) {
			return list.filter((m) => m.team === user.teamNumber);
		}
		return list;
	};

	const allMembers = applyTeamFilter(members);
	const attendingMembers = applyTeamFilter(
		members.filter((m: AfterPartyInvitedMember) => m.isRsvpGoing === true),
	);
	const notAttendingMembers = applyTeamFilter(
		members.filter((m: AfterPartyInvitedMember) => m.isRsvpGoing === false),
	);

	return (
		<section className="flex flex-1 flex-col px-4 py-3">
			<Tabs defaultValue={isClosed ? 'all' : 'attending'}>
				<div className="flex items-center justify-between py-3">
					{isClosed ? (
						<TabsList className="h-auto w-auto gap-2">
							<TabsTrigger
								value="all"
								className="h-8 rounded-md bg-gray-100 px-4 font-medium text-black text-sm data-[state=active]:border-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
							>
								전체
							</TabsTrigger>
							<TabsTrigger
								value="attending"
								className="h-8 rounded-md bg-gray-100 px-4 font-medium text-black text-sm data-[state=active]:border-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
							>
								진행 중
							</TabsTrigger>
						</TabsList>
					) : (
						<TabsList className="h-auto w-auto gap-2">
							<TabsTrigger
								value="attending"
								className="h-8 rounded-md bg-gray-100 px-4 font-medium text-black text-sm data-[state=active]:border-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
							>
								참석
							</TabsTrigger>
							<TabsTrigger
								value="not-attending"
								className="h-8 rounded-md bg-gray-100 px-4 font-medium text-black text-sm data-[state=active]:border-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
							>
								불참
							</TabsTrigger>
						</TabsList>
					)}
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

				{isClosed ? (
					<>
						<TabsContent value="all">
							<MemberListContent members={allMembers} />
						</TabsContent>
						<TabsContent value="attending">
							<MemberListContent members={attendingMembers} />
						</TabsContent>
					</>
				) : (
					<>
						<TabsContent value="attending">
							<MemberListContent members={attendingMembers} />
						</TabsContent>
						<TabsContent value="not-attending">
							<MemberListContent members={notAttendingMembers} />
						</TabsContent>
					</>
				)}
			</Tabs>
		</section>
	);
};

const MemberListContent = ({ members }: { members: AfterPartyInvitedMember[] }) => {
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
