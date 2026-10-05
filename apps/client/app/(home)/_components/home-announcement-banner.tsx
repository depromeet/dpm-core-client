'use client';

import Link from 'next/link';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Megaphone } from 'lucide-react';
import { Skeleton } from '@dpm-core/shared';

import { getAnnouncementListQuery } from '@/remotes/queries/announcement';

export const HomeAnnouncementBanner = ErrorBoundary.with({ fallback: () => null }, () => (
	<Suspense fallback={<HomeAnnouncementSkeleton />}>
		<HomeAnnouncementBannerContainer />
	</Suspense>
));

const HomeAnnouncementSkeleton = () => (
	<output className="block px-4 pt-5 pb-2" aria-label="공지 불러오는 중">
		<Skeleton className="h-10 w-full rounded-xl bg-background-heavy" />
	</output>
);

const HomeAnnouncementBannerContainer = () => {
	const { data } = useSuspenseQuery(getAnnouncementListQuery);
	const announcement = data?.data.announcements[0];

	if (!announcement) return null;

	return (
		<div className="px-4 pt-5 pb-2">
			<Link
				href={`/announcement/${announcement.announcementId}`}
				className="flex h-10 items-center gap-3 rounded-xl bg-primary-extralight px-3 text-body2 text-label-normal"
			>
				<Megaphone className="size-5 shrink-0 fill-primary-normal text-primary-normal" />
				<span className="truncate">{announcement.title}</span>
			</Link>
		</div>
	);
};
