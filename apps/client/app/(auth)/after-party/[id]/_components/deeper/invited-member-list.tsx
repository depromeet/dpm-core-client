'use client';

import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { AfterPartyInvitedMember } from '@dpm-core/api';
import {
	Aesterisk,
	Checkbox,
	Label,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@dpm-core/shared';

import { Profile } from '@/components/attendance/profile';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/empty';
import { useAuth } from '@/providers/auth-provider';
import { getAfterPartyInvitedMembersQueryOptions } from '@/remotes/queries/after-party';

interface InvitedMemberListProps {
	afterPartyId: number;
	isClosed: boolean;
}

export const InvitedMemberList = ({ afterPartyId, isClosed }: InvitedMemberListProps) => {
	const { user } = useAuth();
	const [myTeamOnly, setMyTeamOnly] = useState(false);

	const { data: invitedMembersData } = useSuspenseQuery(
		getAfterPartyInvitedMembersQueryOptions(afterPartyId),
	);
	const members = invitedMembersData.data;

	const applyTeamFilter = (list: AfterPartyInvitedMember[]) => {
		if (myTeamOnly && user?.teamNumber) {
			return list.filter((m) => m.teamNumber === user.teamNumber);
		}
		return list;
	};

	const attendingMembers = applyTeamFilter(
		members.filter((m: AfterPartyInvitedMember) => m.rsvpStatus === true),
	);
	const notAttendingMembers = applyTeamFilter(
		members.filter((m: AfterPartyInvitedMember) => m.rsvpStatus === false),
	);

	return (
		<section className="flex flex-1 flex-col px-4 py-3">
			<Tabs defaultValue="attending">
				<div className="flex items-center justify-between py-3">
					{isClosed ? (
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
							className="size-4 cursor-pointer rounded-sm border-line-normal text-gray-0 shadow-none data-[state=checked]:bg-primary-normal"
							id="my-team-only"
							checked={myTeamOnly}
							onCheckedChange={(checked: boolean | 'indeterminate') =>
								setMyTeamOnly(checked === true)
							}
						/>
						<Label
							htmlFor="my-team-only"
							className="cursor-pointer font-medium text-body2 text-label-assistive"
						>
							내 팀만 보기
						</Label>
					</div>
				</div>

				{isClosed ? (
					<>
						<TabsContent value="attending">
							<MemberListContent members={attendingMembers} />
						</TabsContent>
						<TabsContent value="not-attending">
							<MemberListContent members={notAttendingMembers} />
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
			<Empty>
				<EmptyHeader>
					<Aesterisk />
					<EmptyTitle>해당하는 멤버가 없어요</EmptyTitle>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="flex flex-col">
			{members.map((member) => (
				<Profile
					size={40}
					key={member.memberId}
					name={member.name}
					teamNumber={member.teamNumber}
					part={member.part}
				/>
			))}
		</div>
	);
};
