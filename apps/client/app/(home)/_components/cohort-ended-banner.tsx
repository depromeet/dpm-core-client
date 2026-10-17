import Image from 'next/image';
import type { NextSessionHomeResponse } from '@dpm-core/api';

import cohortEndedBanner from '@/assets/images/cohort-ended-banner.webp';

interface CohortEndedBannerProps {
	cohortValue: NextSessionHomeResponse['cohortValue'];
}

export const CohortEndedBanner = ({ cohortValue }: CohortEndedBannerProps) => {
	return (
		<div className="relative h-43.5 overflow-hidden rounded-lg bg-primary-light">
			<Image
				src={cohortEndedBanner}
				alt=""
				width={453}
				height={255}
				className="-top-15 -left-26.5 absolute h-auto w-[calc(100%+110px)] max-w-none"
			/>
			<h2 className="relative w-fit pt-5.5 pl-5.75 text-left font-semibold text-headline1 text-label-inverse">
				{cohortValue ? `${cohortValue}기 활동을` : '기수 활동을'}
				<br />
				모두 마쳤어요!
			</h2>
		</div>
	);
};
