'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { Part } from '@dpm-core/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@dpm-core/shared';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { EmptyView } from '@/components/attendance/EmptyView';
import { LoadingBox } from '@/components/loading-box';
import { cohort } from '@/constants/cohort';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useIntersect } from '@/hooks/useIntersect';
import { getMemberPartLabel } from '@/lib/member/part';
import { isExistPart } from '@/lib/utils';
import { getAttendanceBySessionOptions } from '@/remotes/queries/attendance';

export const AttendanceList = ({ sessionId }: { sessionId: number }) => {
	const customSearchParams = useCustomSearchParams();
	const searchParams = customSearchParams.getAll();

	const router = useRouter();

	const attendanceSearchParams = {
		week: sessionId,
		statuses: searchParams.statuses ? searchParams.statuses.split(',') : [],
		teams: searchParams.teams ? searchParams.teams.split(',').map(Number) : [],
		name: searchParams.name,
	};

	const { data, fetchNextPage, hasNextPage, fetchStatus, isLoading } = useInfiniteQuery(
		getAttendanceBySessionOptions(attendanceSearchParams),
	);

	const { targetRef } = useIntersect({
		onIntersect: (entry, observer) => {
			if (!hasNextPage) {
				observer.unobserve(entry.target);
				return;
			}

			if (entry.isIntersecting && hasNextPage && fetchStatus !== 'fetching') {
				fetchNextPage();
			}
		},
	});

	const flatData = data?.pages.flatMap((page) => page.data.members) ?? [];

	if (isLoading) {
		return <LoadingBox />;
	}

	if (flatData.length === 0) {
		return <EmptyView className="mt-10 h-[166px]" message="조건에 맞는 디퍼를 찾을 수 없어요" />;
	}

	return (
		<div className="mt-[18px]">
			<Table>
				<TableHeader className="bg-gray-50">
					<TableRow className="border-none">
						<TableHead>멤버</TableHead>
						<TableHead className="w-[200px]">출석 상태</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{flatData.map((member) => {
						return (
							<TableRow
								key={member.id}
								onClick={() => router.push(`/attendance/${member.id}/${sessionId}`)}
							>
								<TableCell>
									<TableProfile
										size={40}
										name={member.name}
										teamNumber={member.teamNumber}
										part={member.part}
									/>
								</TableCell>
								<TableCell>
									<AttendanceStatusLabel status={member.attendanceStatus} />
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
			<div ref={targetRef} />
		</div>
	);
};

interface TableProfileProps extends React.ComponentProps<'div'> {
	part: Exclude<Part, 'ETC'>;
	name: string;
	teamNumber: number;
	size?: number;
}

export const TableProfile = (props: TableProfileProps) => {
	const { part, name, teamNumber, size = 40 } = props;

	return (
		<figure className="flex items-center gap-3">
			<div className="flex-shrink-0 overflow-hidden rounded-full bg-background-strong">
				<Image
					width={size}
					height={size}
					src={isExistPart(part) ? cohort[part] : cohort.WEB}
					alt={`${part} 파트 프로필 이미지`}
				/>
			</div>
			<figcaption className="flex">
				<strong className="mr-3 font-semibold text-body1 text-foreground">{name}</strong>
				<p className="flex items-center gap-1.5 text-caption1 text-label-assistive">
					<span>{teamNumber}팀</span>
					<span aria-hidden="true" className="h-3 border-line-subtle border-l" />
					<span>{getMemberPartLabel(part)}</span>
				</p>
			</figcaption>
		</figure>
	);
};
