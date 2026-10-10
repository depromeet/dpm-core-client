import Link from 'next/link';
import type { CurrentWeekSessionResponse } from '@dpm-core/api';
import { cn, formatKoreanDate, formatTimeOnly } from '@dpm-core/shared';

interface SessionCardProps {
	session: CurrentWeekSessionResponse;
	isAttendanceOpen: boolean;
}

export const SessionCard = ({ session, isAttendanceOpen }: SessionCardProps) => {
	const place = session.isOnline ? '온라인' : session.place;

	return (
		<div className="flex h-43.5 flex-col rounded-lg bg-background-normal p-5">
			<div
				className={cn('flex min-w-0 gap-2', isAttendanceOpen ? 'items-center' : 'flex-col gap-1')}
			>
				<div className="flex items-center justify-between gap-2">
					<span
						className={cn(
							'shrink-0 text-caption1 text-label-assistive',
							isAttendanceOpen && 'rounded bg-background-subtle px-1 py-0.5',
						)}
					>
						{session.week}주차 {isAttendanceOpen ? '' : ' 세션'}
					</span>
					{!isAttendanceOpen ? (
						<Link
							href={`/attendance/me/${session.id}/absence-reason`}
							className="shrink-0 text-[10px] text-label-assistive leading-4"
						>
							이번주 참석이 어렵다면 &gt;
						</Link>
					) : null}
				</div>
				<h3 className="truncate font-semibold text-body1 text-label-normal" title={session.name}>
					{session.name}
				</h3>
			</div>
			<div className="my-4 h-px shrink-0 bg-line-normal" />
			<dl className="flex flex-col gap-y-3 text-body2">
				<div className="flex gap-x-4">
					<dt
						className={cn(
							'shrink-0 font-semibold text-label-assistive',
							!isAttendanceOpen && 'w-17.5',
						)}
					>
						{isAttendanceOpen ? '시간' : '세션 시간'}
					</dt>
					<dd className="min-w-0 truncate text-label-subtle">
						{formatKoreanDate(session.date)} {formatTimeOnly(session.date)}
					</dd>
				</div>
				<div className="flex gap-x-4">
					<dt
						className={cn(
							'shrink-0 font-semibold text-label-assistive',
							!isAttendanceOpen && 'w-17.5',
						)}
					>
						{isAttendanceOpen ? '장소' : '세션 장소'}
					</dt>
					<dd className="min-w-0 truncate text-label-subtle" title={place}>
						{place}
					</dd>
				</div>
			</dl>
		</div>
	);
};
