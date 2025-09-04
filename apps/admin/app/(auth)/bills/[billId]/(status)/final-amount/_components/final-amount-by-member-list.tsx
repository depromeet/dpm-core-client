'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getBillFinalAmountMemberByIdQueryOptions } from '@/remotes/queries/bill';
import { FinalAmountByMemberItem } from './final-amount-by-member-item';

interface FinalAmountByMemberListProps {
	billId: number;
}
export const FinalAmountByMemberList = ({ billId }: FinalAmountByMemberListProps) => {
	const {
		data: { data: billFinalAmountMemberList },
	} = useSuspenseQuery(getBillFinalAmountMemberByIdQueryOptions(billId));

	return (
		<section className="mt-2">
			<ul>
				{billFinalAmountMemberList.members.map((member) => (
					<li key={member.name} className="px-4 py-3">
						<FinalAmountByMemberItem member={member} />
					</li>
				))}
			</ul>
		</section>
	);
};
