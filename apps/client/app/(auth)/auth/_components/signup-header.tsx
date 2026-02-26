'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { getCurrentCohortQueryOptions } from '@/remotes/queries/cohort';

export const SignupHeader = () => {
	const {
		data: { data },
	} = useSuspenseQuery(getCurrentCohortQueryOptions());

	return (
		<header className="mb-5">
			<h1 className="mb-1.5 font-bold text-headline1 text-label-normal">
				{`디프만 ${data.cohortNumber}기 멤버 확인을 위해`}
				<br />
				정보를 입력해주세요
			</h1>
			<p className="font-medium text-body2 text-label-subtle">
				합격자 명단과 일치하면 바로 멤버 인증이 완료됩니다
			</p>
		</header>
	);
};
