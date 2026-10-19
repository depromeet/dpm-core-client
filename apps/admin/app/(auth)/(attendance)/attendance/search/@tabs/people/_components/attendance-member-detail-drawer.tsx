'use client';

import { Suspense } from 'react';
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useQueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import type { MyAttendanceSession } from '@dpm-core/api';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	ATTENDANCE_STATUS_OPTIONS,
	Badge,
	Button,
	cn,
	Dialog,
	DialogContent,
	DialogTitle,
	formatDotFullDate,
	formatKoreanDate,
	formatTimeOnly,
	Pencil,
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	XCircle,
} from '@dpm-core/shared';

import { AttendanceStatusLabel, EvidencePreview, Profile } from '@/components/attendance';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { useAttendanceStatusEdit } from '@/hooks';
import { getAttendanceMemberStatusLabel } from '@/lib/attendance/status';
import { getAttendanceByMemberDetailOptions } from '@/remotes/queries/attendance';

interface AttendanceMemberDetailDrawerProps {
	memberId: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
interface AttendanceMemberDetailProps {
	memberId: number;
}
function AttendanceMemberDetail({ memberId }: AttendanceMemberDetailProps) {
	const {
		data: { data },
	} = useSuspenseQuery(getAttendanceByMemberDetailOptions({ memberId }));
	const counts = [
		{ label: '출석', value: data.attendance.presentCount },
		{ label: '지각', value: data.attendance.lateCount },
		{ label: '인정', value: data.attendance.excusedAbsentCount },
		{ label: '결석', value: data.attendance.absentCount },
	];
	return (
		<div className="min-h-0 flex-1 overflow-y-auto px-10 pb-15">
			<div className="mb-4 flex items-start justify-between [&>div>div:first-child]:p-1.5 [&>div]:gap-3 [&_.text-body1]:text-title2">
				<Profile
					size={48}
					name={data.member.name}
					part={data.member.part}
					teamNumber={data.member.teamNumber}
					isAdmin={data.member.isAdmin}
					badge={
						<Badge variant={data.member.attendanceStatus}>
							{getAttendanceMemberStatusLabel(data.member.attendanceStatus)}
						</Badge>
					}
				/>
			</div>
			<ul className="mb-2 grid grid-cols-4 gap-2 rounded-xl bg-background-subtle px-3 py-2">
				{counts.map(({ label, value }) => (
					<li
						key={label}
						className="flex flex-col items-center gap-1 border-line-normal border-r py-2 text-body2 last:border-0"
					>
						<span className="font-medium text-label-assistive">{label}</span>
						<span
							className={cn(
								'font-semibold text-label-normal',
								label === '출석' && 'text-primary-normal',
								label === '결석' && 'text-red-500',
							)}
						>
							{value}
						</span>
					</li>
				))}
			</ul>
			{data.sessions.length === 0 ? (
				<p className="py-10 text-center text-body2 text-label-assistive">출석 기록이 없어요</p>
			) : (
				<Accordion type="multiple">
					{data.sessions.map((session) => (
						<MemberSession key={session.id} memberId={memberId} session={session} />
					))}
				</Accordion>
			)}
		</div>
	);
}
interface MemberSessionProps {
	memberId: number;
	session: MyAttendanceSession;
}
function MemberSession({ memberId, session }: MemberSessionProps) {
	const {
		isEditMode,
		selectedStatus,
		setSelectedStatus,
		handleEdit,
		handleSave,
		handleCancel,
		isLoading,
	} = useAttendanceStatusEdit({
		memberId,
		sessionId: session.id,
		initialStatus: session.attendanceStatus,
		successMessage: '출석 상태를 변경했어요.',
	});
	return (
		<AccordionItem
			value={String(session.id)}
			className="border-line-normal px-3 py-4 last:border-b"
		>
			<div className="relative">
				<AccordionTrigger
					className="data-[state=closed]:-mb-0.75 items-center gap-3 rounded-none p-0 font-normal text-inherit"
					icon={
						<ChevronDown
							size={24}
							className="shrink-0 text-label-assistive transition-transform duration-200"
						/>
					}
				>
					<div className="min-w-0 flex-1">
						<p className="mb-0.5 font-medium text-body2 text-label-assistive leading-4.75">
							{session.week}주차
						</p>
						<p className="wrap-break-word font-semibold text-body1 text-label-normal">
							{session.eventName}
						</p>
						<p className="mt-1 font-medium text-body2 text-label-assistive leading-4.75">
							{formatDotFullDate(session.date, { withTime: true })}
						</p>
					</div>
					<span className="mr-6 shrink-0">
						<AttendanceStatusLabel status={session.attendanceStatus} />
					</span>
				</AccordionTrigger>
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							type="button"
							onClick={handleEdit}
							className="-translate-y-1/2 absolute top-1/2 right-9 size-4 cursor-pointer rounded-sm bg-background-subtle"
						>
							<Pencil width={10.5} height={10.5} className="absolute top-[2.95px] left-[2.95px]" />
						</button>
					</TooltipTrigger>
					<TooltipContent
						side="bottom"
						sideOffset={12}
						className="[&_svg]:hidden! rounded-md bg-gray-800 px-3 py-2 text-caption1 text-white"
					>
						출석 상태 수정
					</TooltipContent>
				</Tooltip>
			</div>
			<AccordionContent className="pt-3.25 pb-0">
				<div className="rounded-lg bg-background-subtle px-5 py-3 text-body2">
					<dl className="grid grid-cols-[72px_minmax(0,1fr)] gap-x-3 gap-y-3">
						<dt className="text-label-assistive">출석 시간</dt>
						<dd className="text-label-normal">
							{session.attendedAt
								? `${formatKoreanDate(session.attendedAt)} ${formatTimeOnly(session.attendedAt)}`
								: '-'}
						</dd>
						<dt className="text-label-assistive">세션 장소</dt>
						<dd className="wrap-break-word text-label-normal">
							{session.isOnline ? '온라인' : session.place}
						</dd>
						{session.absenceReason ? (
							<>
								<dt className="text-label-assistive">결석 사유</dt>
								<dd className="min-w-0 space-y-2 text-label-normal">
									<p className="whitespace-pre-wrap break-all">{session.absenceReason.contents}</p>
									{session.absenceReason.images.map((image, index) => (
										<div
											key={image.imageId}
											className="[&>button]:rounded-lg [&>button]:bg-background-normal [&>button]:px-2 [&>button]:py-1 [&>button]:text-caption1"
										>
											<EvidencePreview {...image} sequence={index + 1} />
										</div>
									))}
								</dd>
							</>
						) : null}
					</dl>
				</div>
			</AccordionContent>
			<Dialog
				open={isEditMode}
				onOpenChange={(open) => {
					if (!open && !isLoading) handleCancel();
				}}
			>
				<DialogContent
					showCloseButton={false}
					className="max-w-147.25! gap-8 bg-background-normal p-8"
					onEscapeKeyDown={(event) => {
						if (isLoading) event.preventDefault();
					}}
					onPointerDownOutside={(event) => {
						if (isLoading) event.preventDefault();
					}}
				>
					<div className="flex items-center justify-between">
						<DialogTitle className="text-headline2 tracking-[-0.02em]">출석 상태 수정</DialogTitle>
						<Button
							type="button"
							variant="none"
							size="none"
							onClick={handleCancel}
							disabled={isLoading}
						>
							<XCircle className="size-6 text-label-assistive" />
						</Button>
					</div>
					<div className="relative flex h-12 overflow-hidden rounded-lg after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-line-normal after:ring-inset">
						{ATTENDANCE_STATUS_OPTIONS.map((option) => (
							<button
								type="button"
								key={option.value}
								disabled={isLoading}
								onClick={() => setSelectedStatus(option.value)}
								className={cn(
									'h-full min-w-0 flex-1 cursor-pointer border-line-normal border-r text-body2 first:rounded-l-lg last:rounded-r-lg last:border-0 disabled:cursor-default',
									selectedStatus === option.value
										? 'bg-primary-extralight font-semibold text-primary-normal'
										: 'text-label-assistive',
								)}
							>
								{option.label}
							</button>
						))}
					</div>
					<div className="flex gap-2">
						<Button
							type="button"
							variant="assistive"
							size="md"
							className="h-12 flex-1 bg-gray-400 text-white hover:bg-gray-500"
							onClick={handleCancel}
							disabled={isLoading}
						>
							취소
						</Button>
						<Button
							type="button"
							variant="secondary"
							size="md"
							className="h-12 flex-1"
							onClick={handleSave}
							disabled={isLoading || selectedStatus === session.attendanceStatus}
						>
							{isLoading ? '저장 중' : '저장'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</AccordionItem>
	);
}
export function AttendanceMemberDetailDrawer({
	memberId,
	open,
	onOpenChange,
}: AttendanceMemberDetailDrawerProps) {
	const { reset: resetQueries } = useQueryErrorResetBoundary();
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full max-w-150! gap-0 border-none p-0">
				<SheetHeader className="h-20 shrink-0 flex-row items-center justify-between px-10">
					<SheetTitle className="font-bold text-label-normal text-title1">출석 현황</SheetTitle>
					<SheetClose asChild>
						<Button variant="none" size="none" className="size-6">
							<XCircle className="size-6 text-label-assistive" />
						</Button>
					</SheetClose>
				</SheetHeader>
				<ErrorBoundary
					key={memberId}
					onReset={resetQueries}
					fallback={({ reset }: ErrorBoundaryFallbackProps) => <ErrorBox onReset={reset} />}
				>
					<Suspense fallback={<LoadingBox />}>
						<AttendanceMemberDetail memberId={memberId} />
					</Suspense>
				</ErrorBoundary>
			</SheetContent>
		</Sheet>
	);
}
