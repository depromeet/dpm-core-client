import type { Gathering } from '@dpm-core/api';
import { GatheringItem } from './gathering-item';

export const GatheringList = ({
	gatherings,
	invitationSubmittedCount,
}: {
	gatherings: Gathering[];
	invitationSubmittedCount: number;
}) => {
	return (
		<>
			<h2 className="px-4 py-2 text-label-strong font-semibold text-title2">회식 참석 현황</h2>
			<ul className="flex flex-col">
				{gatherings.map((gathering) => (
					<GatheringItem
						key={gathering.gatheringId}
						gathering={gathering}
						invitationSubmittedCount={invitationSubmittedCount}
					/>
				))}
			</ul>
		</>
	);
};
