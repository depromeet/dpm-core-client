import Link from 'next/link';
import type { MyAttendanceSession } from '@dpm-core/api';
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	formatDotFullDate,
	formatKoreanDate,
	formatTimeOnly,
	Pencil,
} from '@dpm-core/shared';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';

import { AbsenceEvidenceFiles } from './absence-evidence-files';

type SessionItemProps = MyAttendanceSession;

export const SessionItem = (props: SessionItemProps) => {
	const { id, week, eventName, date, attendanceStatus, attendedAt, place, absenceReason } = props;
	const showReason =
		attendanceStatus === 'ABSENT' ||
		attendanceStatus === 'EXCUSED_ABSENT' ||
		Boolean(absenceReason);

	return (
		<AccordionItem value={id.toString()} className="border-line-normal px-3">
			<AccordionTrigger className="items-center py-0">
				<div className="flex w-full items-center justify-between gap-[5.5px] pt-4 pb-3.25">
					<div className="min-w-0">
						<p className="mb-0.5 font-medium text-body2 text-label-assistive">{week}주차</p>
						<p className="wrap-break-word mb-1 font-semibold text-body1 text-label-normal">
							{eventName}
						</p>
						<p className="font-medium text-body2 text-label-assistive">
							{formatDotFullDate(date, { withTime: true })}
						</p>
					</div>
					<AttendanceStatusLabel
						status={attendanceStatus}
						absenceReasonStatus={absenceReason?.status}
						className="shrink-0 gap-0.5 text-label-subtle"
					/>
				</div>
			</AccordionTrigger>
			<AccordionContent>
				<div className="space-y-3 rounded-lg bg-background-subtle px-5 py-3 text-body2">
					<div className="flex gap-4">
						<p className="w-17.5 shrink-0 font-semibold text-label-assistive">출석 시간</p>
						<p className="wrap-break-word min-w-0 flex-1 text-label-subtle">
							{attendedAt ? `${formatKoreanDate(attendedAt)} ${formatTimeOnly(attendedAt)}` : '-'}
						</p>
					</div>
					<div className="flex gap-4">
						<p className="w-17.5 shrink-0 font-semibold text-label-assistive">세션 장소</p>
						<p className="wrap-break-word min-w-0 flex-1 text-label-subtle">{place || '-'}</p>
					</div>
					{showReason ? (
						<div className="flex gap-4">
							<p className="w-17.5 shrink-0 font-semibold text-label-assistive">결석 사유</p>
							<div className="min-w-0 flex-1 space-y-2 text-label-subtle">
								<p className="wrap-break-word">{absenceReason?.contents || '-'}</p>
								<AbsenceEvidenceFiles images={absenceReason?.images ?? []} />
							</div>
							<Link
								href={`/attendance/me/${id}/absence-reason`}
								aria-label={`${week}주차 결석 사유 ${absenceReason ? '수정' : '작성'}`}
							>
								<Pencil />
							</Link>
						</div>
					) : null}
					{attendanceStatus === 'PENDING' ? (
						<Link
							className="font-medium text-caption1 text-label-assistive"
							href={`/attendance/me/${id}/absence-reason`}
						>
							세션 참석이 어렵다면 &gt;
						</Link>
					) : null}
				</div>
			</AccordionContent>
		</AccordionItem>
	);
};
