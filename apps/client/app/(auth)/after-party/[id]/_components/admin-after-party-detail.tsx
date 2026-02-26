'use client';

import Link from 'next/link';
import { Fragment, Suspense } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Button, Divider } from '@dpm-core/shared';

import { LoadingBox } from '@/components/loading-box';
import { getAfterPartyByIdQueryOptions } from '@/remotes/queries/after-party';

import { AfterPartyInfo } from './after-party-info';
import { AfterPartyRsvp } from './after-party-rsvp';
import { AfterPartyRsvpOverview } from './after-party-rsvp-overview';

interface AdminAfterDetailProps {
	afterPartyId: number;
}

const AdminAfterPartyDetailContainer = (props: AdminAfterDetailProps) => {
	const { afterPartyId } = props;
	const {
		data: { data: afterParty },
	} = useSuspenseQuery(getAfterPartyByIdQueryOptions(afterPartyId));

	return (
		<Fragment>
			<AfterPartyInfo {...afterParty} />
			<Divider className="h-2.5" />
			<AfterPartyRsvp
				title={afterParty.title}
				rsvpStatus={afterParty.rsvpStatus}
				gatheringId={afterParty.gatheringId}
			/>
			<Divider className="h-2.5" />
			<AfterPartyRsvpOverview
				gatheringId={afterParty.gatheringId}
				attendanceCount={afterParty.attendanceCount}
				isRsvpGoingCount={afterParty.isRsvpGoingCount}
				inviteeCount={afterParty.inviteeCount}
			/>
		</Fragment>
	);
};

export const AdminAfterPartyDetail = (props: AdminAfterDetailProps) => {
	return (
		<ErrorBoundary fallback={<AdminAfterPartyErrorFallback />}>
			<Suspense fallback={<LoadingBox />}>
				<AdminAfterPartyDetailContainer {...props} />
			</Suspense>
		</ErrorBoundary>
	);
};

const AdminAfterPartyErrorFallback = () => {
	return (
		<div className="relative flex w-full flex-1 flex-col items-center justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="33"
				height="32"
				viewBox="0 0 33 32"
				fill="none"
			>
				<title>error</title>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M32.5 16C32.5 24.8366 25.3366 32 16.5 32C7.66344 32 0.499999 24.8366 0.5 16C0.500001 7.16344 7.66345 -7.72516e-07 16.5 0C25.3366 7.72516e-07 32.5 7.16345 32.5 16ZM15 22C15 21.1716 15.6716 20.5 16.5 20.5C17.3284 20.5 18 21.1716 18 22C18 22.8284 17.3284 23.5 16.5 23.5C15.6716 23.5 15 22.8284 15 22ZM16.5 18.48C15.6716 18.48 15 17.8084 15 16.98L15 9.97998C15 9.15155 15.6716 8.47998 16.5 8.47998C17.3284 8.47998 18 9.15155 18 9.97998V16.98C18 17.8084 17.3284 18.48 16.5 18.48Z"
					fill="#E5E7EB"
				/>
			</svg>
			<h1 className="mt-8 mb-4 text-center font-bold text-label-strong text-title1">
				존재하지 않는 회식입니다.
			</h1>
			<p className="text-center font-medium text-body2 text-label-assistive">
				변경 혹은 삭제되어 회식 정보를 찾을 수 없어요.
			</p>
			<section className="fixed bottom-0 w-full max-w-lg px-4 py-8">
				<Button variant="secondary" size="lg" className="w-full" asChild>
					<Link href="/after-party">회식 리스트로 돌아가기</Link>
				</Button>
			</section>
		</div>
	);
};
