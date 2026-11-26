'use client';

import Link from 'next/link';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Megaphone, Skeleton } from '@dpm-core/shared';

import { getAnnouncementListQuery } from '@/remotes/queries/announcement';

interface HomeAnnouncementBannerProps {
	query?: typeof getAnnouncementListQuery;
}

export const HomeAnnouncementBanner = ({
	query = getAnnouncementListQuery,
}: HomeAnnouncementBannerProps) => (
	<ErrorBoundary fallback={() => null}>
		<Suspense fallback={<HomeAnnouncementSkeleton />}>
			<HomeAnnouncementBannerContainer query={query} />
		</Suspense>
	</ErrorBoundary>
);

const HomeAnnouncementSkeleton = () => (
	<output className="block px-4 pt-5 pb-2" aria-label="공지 불러오는 중">
		<Skeleton className="h-10 w-full rounded-xl bg-background-heavy" />
	</output>
);

const HomeAnnouncementBannerContainer = ({ query }: { query: typeof getAnnouncementListQuery }) => {
	const { data } = useSuspenseQuery(query);
	const announcement = data?.data.announcements[0];

	if (!announcement) return null;

	return (
		<div className="px-4 pt-5 pb-2">
			<Link
				href={`/announcement/${announcement.announcementId}?returnTo=%2F`}
				className="flex h-10 items-center gap-2 rounded-xl bg-primary-extralight px-3 text-body2 text-label-normal"
			>
				<Megaphone className="size-6 shrink-0" />
				<span className="truncate">{announcement.title}</span>
			</Link>
		</div>
	);
};
