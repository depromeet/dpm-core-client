'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { ErrorBoundary } from '@suspensive/react';
import { useMutation, useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import {
	Button,
	cn,
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	Label,
	Textarea,
	toast,
} from '@dpm-core/shared';

import AttendanceStatusLabel from '@/components/attendance/AttendanceStatusLabel';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { formatISOStringToFullDateString } from '@/lib/date';
import { submitAbsenceReasonOptions } from '@/remotes/mutations/attendance';
import {
	getAttendanceMeBySessionIdOptions,
	getMyAbsenceReasonOptions,
} from '@/remotes/queries/attendance';

const MAX_REASON_LENGTH = 50;

const SubmitCompleteIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M16 0C24.8363 6.69993e-05 31.9998 7.16372 32 16C32 24.8364 24.8364 31.9999 16 32C7.16351 32 0 24.8365 0 16C0.000196881 7.16368 7.16363 0 16 0ZM22.2773 10.7803C21.6596 10.1113 20.6577 10.1111 20.04 10.7803L13.7773 17.5654L11.7324 15.3506C11.1147 14.6814 10.1129 14.6814 9.49512 15.3506C8.87759 16.0198 8.87752 17.1043 9.49512 17.7734L12.6592 21.2012C13.2769 21.8699 14.2779 21.87 14.8955 21.2012L22.2773 13.2041C22.8951 12.5349 22.8951 11.4495 22.2773 10.7803Z"
			fill="#5E83FE"
		/>
	</svg>
);

interface SessionInfo {
	week: number;
	eventName: string;
	date: string;
	place: string | null;
}

function SessionInfoCard({ session }: { session: SessionInfo }) {
	const rows = [
		{ label: '세션 주차', value: `${session.week}주차` },
		{ label: '세션명', value: session.eventName },
		{ label: '세션 날짜', value: formatISOStringToFullDateString(session.date) },
		{ label: '세션 장소', value: session.place ?? '-' },
	];

	return (
		<div className="flex flex-col gap-2">
			<p className="font-semibold text-body1 text-label-subtle">세션 정보</p>
			<div className="flex flex-col gap-3 rounded-lg bg-background-subtle px-5 py-3 text-body2">
				{rows.map(({ label, value }) => (
					<div key={label} className="flex gap-4">
						<p className="w-17.5 shrink-0 font-semibold text-label-assistive">{label}</p>
						<p className="min-w-0 flex-1 font-medium text-label-subtle">{value}</p>
					</div>
				))}
			</div>
		</div>
	);
}

interface AbsenceReasonDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	sessionId: number;
	session: SessionInfo;
	onSubmitSuccess: () => void;
}

function AbsenceReasonDrawer({
	open,
	onOpenChange,
	sessionId,
	session,
	onSubmitSuccess,
}: AbsenceReasonDrawerProps) {
	const [reason, setReason] = useState('');
	const [isError, setIsError] = useState(false);
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation(submitAbsenceReasonOptions(sessionId));

	const handleSubmit = async () => {
		if (!reason.trim()) {
			setIsError(true);
			toast.error('결석 사유를 입력해주세요');
			return;
		}

		setIsError(false);

		try {
			await mutateAsync({ contents: reason.trim() });
			await queryClient.invalidateQueries(getMyAbsenceReasonOptions({ sessionId }));
			onSubmitSuccess();
		} catch {
			toast.error('결석 사유 제출에 실패했어요. 다시 시도해주세요.');
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value.slice(0, MAX_REASON_LENGTH);
		setReason(value);
		if (isError && value.trim()) setIsError(false);
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className="mx-auto flex max-h-[90vh] min-h-149.5 max-w-lg flex-col pb-safe-area">
				<DrawerHeader showCloseButton className="shrink-0 gap-3 px-4 pt-6 pb-3 text-left">
					<DrawerTitle className="text-left font-bold text-[22px] text-label-normal leading-7.5">
						결석 사유서 제출
					</DrawerTitle>
					<DrawerDescription className="text-left font-medium text-[#81898f] text-[14px] leading-5.5">
						이 설정은 세션 생성 시 기본값으로 자동 입력되며, 필요할 때 수정할 수 있어요.
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pt-3 pb-6">
					<SessionInfoCard session={session} />

					<div className="flex flex-col gap-2">
						<Label>결석 사유</Label>
						<Textarea
							variant="line"
							placeholder="ex) 아파서 병원다녀옴"
							value={reason}
							onChange={handleChange}
							aria-invalid={isError}
						/>
						<div
							className={cn(
								'flex w-full items-center',
								isError ? 'justify-between' : 'justify-end',
							)}
						>
							{isError && (
								<p className="whitespace-nowrap font-medium text-[12px] text-red-400 leading-4 tracking-[-0.24px]">
									결석 사유를 입력해주세요
								</p>
							)}
							<p className="whitespace-nowrap text-right font-medium text-[12px] text-label-subtle leading-4 tracking-[-0.24px]">
								{reason.length} / {MAX_REASON_LENGTH}자
							</p>
						</div>
					</div>
				</div>

				<DrawerFooter className="shrink-0 px-5 pt-3 pb-5">
					<Button
						variant="primary"
						size="lg"
						className="w-full"
						onClick={handleSubmit}
						loading={isPending}
					>
						제출
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

function AbsenceReasonSubmitted() {
	const router = useRouter();

	return (
		<div className="absolute inset-0 z-50 flex flex-col bg-background-normal">
			<div className="flex flex-1 flex-col items-center justify-center gap-8 px-5">
				<SubmitCompleteIcon />
				<div className="flex flex-col items-center gap-2">
					<p className="text-center font-bold text-[#1a1c1e] text-[20px] leading-[1.4] tracking-[-0.2px]">
						결석 사유서 제출 완료
					</p>
					<div className="text-center font-medium text-body1 text-label-subtle">
						<p>운영진이 검토 후 승인할 예정이에요.</p>
						<p>다소 시간이 걸릴 수 있어요.</p>
					</div>
				</div>
			</div>
			<div className="px-5 pt-3 pb-5">
				<Button variant="secondary" size="lg" className="w-full" onClick={() => router.push('/')}>
					홈으로
				</Button>
			</div>
		</div>
	);
}

interface AttendanceSessionDetailContainerProps {
	sessionId: number;
	onSubmitSuccess: () => void;
}

const AttendanceSessionDetailContainer = ({
	sessionId,
	onSubmitSuccess,
}: AttendanceSessionDetailContainerProps) => {
	const [{ data: attendanceData }, { data: absenceReasonData }] = useSuspenseQueries({
		queries: [
			getAttendanceMeBySessionIdOptions({ sessionId }),
			getMyAbsenceReasonOptions({ sessionId }),
		],
	});

	const { session, attendance } = attendanceData.data;
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const hasSubmittedAbsenceReason = Boolean(absenceReasonData.data?.status);
	const isAbsent = attendance.status === 'ABSENT' && !hasSubmittedAbsenceReason;

	return (
		<>
			<section className="mt-5">
				<article className="mb-5 px-4">
					<h3 className="mb-3 font-semibold text-body1 text-label-subtle">출석 정보</h3>
					<div className="flex flex-col gap-3 rounded-lg bg-background-subtle px-5 py-3 font-semibold text-body2">
						<div className="flex gap-4">
							<p className="w-17.5 text-label-assistive">출석 상태</p>
							<AttendanceStatusLabel status={attendance.status} />
						</div>
						<div className="flex gap-4">
							<p className="w-17.5 text-label-assistive">출석 시간</p>
							<p className="font-medium text-label-subtle">
								{formatISOStringToFullDateString(attendance.attendedAt)}
							</p>
						</div>
					</div>
				</article>
				<article className="mt-5 mb-5 px-4">
					<SessionInfoCard session={session} />
				</article>
			</section>

			{isAbsent && (
				<>
					{/* 하단 고정 버튼 영역만큼 콘텐츠 영역에 여백 확보 */}
					<div className="h-20" aria-hidden="true" />
					<div className="fixed right-0 bottom-0 left-0 z-10 mx-auto max-w-lg bg-background-normal px-5 pt-3 pb-5">
						<Button
							variant="primary"
							size="lg"
							className="w-full"
							onClick={() => setIsDrawerOpen(true)}
						>
							결석 사유 제출하기
						</Button>
					</div>
					<AbsenceReasonDrawer
						open={isDrawerOpen}
						onOpenChange={setIsDrawerOpen}
						sessionId={sessionId}
						session={session}
						onSubmitSuccess={onSubmitSuccess}
					/>
				</>
			)}
		</>
	);
};

interface AttendanceSessionDetailProps {
	sessionId: number;
}

export const AttendanceSessionDetail = ({ sessionId }: AttendanceSessionDetailProps) => {
	const [isSubmitted, setIsSubmitted] = useState(false);

	if (isSubmitted) {
		return <AbsenceReasonSubmitted />;
	}

	return (
		<ErrorBoundary
			fallback={({ reset }: ErrorBoundaryFallbackProps) => <ErrorBox onReset={reset} />}
		>
			<Suspense fallback={<LoadingBox />}>
				<AttendanceSessionDetailContainer
					sessionId={Number(sessionId)}
					onSubmitSuccess={() => setIsSubmitted(true)}
				/>
			</Suspense>
		</ErrorBoundary>
	);
};
