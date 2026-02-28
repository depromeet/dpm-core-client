import type { AfterPartyDetail } from '@dpm-core/api';
import { formatKoreanDate, formatKoreanDateWithTime } from '@dpm-core/shared';

interface AfterPartyInfoProps {
	afterPartyDetail: AfterPartyDetail;
}

export const AfterPartyInfo = ({ afterPartyDetail }: AfterPartyInfoProps) => {
	return (
		<section className="flex flex-col gap-5 px-4 pt-4 pb-6">
			<h2 className="font-bold text-headline2">{afterPartyDetail.title}</h2>
			<p className="font-medium text-body2 text-gray-400">{afterPartyDetail.description}</p>
			<div className="flex flex-col gap-3">
				<div className="flex gap-4">
					<div className="font-semibold text-body2 text-gray-400">회식 날짜</div>
					<div className="font-medium text-body2 text-gray-600">
						{formatKoreanDate(afterPartyDetail.scheduledAt)}
					</div>
				</div>
				<div className="flex gap-4">
					<div className="font-semibold text-body2 text-gray-400">조사 기한</div>
					<div className="font-medium text-body2 text-gray-600">
						{formatKoreanDateWithTime(afterPartyDetail.closedAt)}
					</div>
				</div>
				<div className="flex gap-4">
					<div className="font-semibold text-body2 text-gray-400">초대 범위</div>
					<div className="flex gap-1">
						{afterPartyDetail.inviteTags.inviteTags.map((tag) => (
							<div
								key={tag.authorityId}
								className="rounded-sm bg-gray-100 px-1.25 py-0.75 font-semibold text-caption1 text-gray-500"
							>
								@<span className="ml-0.5">{tag.tagName}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
