'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getBillSubmittedMemberByIdQueryOptions } from '@/remotes/queries/bill';
import { useBillSubmittedStatusSearchParams } from '../_hooks/use-bill-submitted-status-search-params';
import { SubmitStatusFilter } from './submit-status-filter';
import { SubmittedMemberItem } from './submitted-member-item';

interface SubmittedMemberListProps {
	billId: number;
}
export const SubmittedMemberList = ({ billId }: SubmittedMemberListProps) => {
	const {
		data: { data: submittedMemberList },
	} = useSuspenseQuery(getBillSubmittedMemberByIdQueryOptions(billId));

	const { submitStatus } = useBillSubmittedStatusSearchParams();

	const filteredMember = submittedMemberList.members.filter((member) => {
		if (submitStatus === 'SUBMIT') {
			return member.isInvitationSubmitted;
		}
		if (submitStatus === 'UNSUBMIT') {
			return !member.isInvitationSubmitted;
		}
		return true;
	});

	return (
		<section>
			<SubmitStatusFilter />
			<ul className="mt-2">
				{filteredMember.map((member) => (
					<li key={member.name} className="px-4 py-3">
						<SubmittedMemberItem member={member} />
					</li>
				))}
			</ul>
		</section>
	);
};
