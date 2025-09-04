'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getGatheringMembersQueryOptions } from '@/remotes/queries/gathering';
import { useGatheringStatusSearchParams } from '../_hooks/use-gathering-status-search-params';
import { BillGatheringFilter } from './bill-gathering-filter';
import { BillGatheringItem } from './bill-gathering-item';

interface BillGatheringListProps {
	gatheringId: number;
}
export const BillGatheringList = ({ gatheringId }: BillGatheringListProps) => {
	const {
		data: { data: gatheringMemberList },
	} = useSuspenseQuery(getGatheringMembersQueryOptions({ gatheringId }));

	const { attendStatus } = useGatheringStatusSearchParams();

	const filteredMember = gatheringMemberList.members.filter((member) => {
		if (attendStatus === 'ATTEND') {
			return member.isJoined;
		}
		if (attendStatus === 'ABSENT') {
			return !member.isJoined;
		}
		if (attendStatus === 'ALL') return true;
	});

	return (
		<section>
			<BillGatheringFilter />
			<ul className="mt-2">
				{filteredMember.map((member) => (
					<li key={member.name} className="px-4 py-3">
						<BillGatheringItem member={member} />
					</li>
				))}
			</ul>
		</section>
	);
};
