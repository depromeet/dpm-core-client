'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import {
	QueryErrorResetBoundary,
	useMutation,
	useQueryClient,
	useSuspenseQueries,
} from '@tanstack/react-query';
import { HTTPError } from 'ky';
import type { ApiErrorReponse, AttendanceStatus, MyAbsenceReasonResponse } from '@dpm-core/api';
import { Button, Divider, Label, Textarea, toast } from '@dpm-core/shared';

import { LoadingBox } from '@/components/loading-box';
import { formatISOStringToFullDateString } from '@/lib/date';
import { submitAbsenceReasonOptions } from '@/remotes/mutations/attendance';
import {
	getAttendanceMeBySessionIdOptions,
	getMyAbsenceReasonOptions,
} from '@/remotes/queries/attendance';
import { getSessionDetailQuery } from '@/remotes/queries/session';

import { SessionDetailErrorFallback } from './session-detail-error-fallback';

export interface AttendanceSessionDetailPreviewData {
	attendance: {
		status: AttendanceStatus;
		attendedAt: string | null;
	};
	session: SessionInfoCardProps;
	absenceReason: MyAbsenceReasonResponse | null;
}

interface AbsenceReasonSubmitProps {
	sessionId: number;
}

export const AbsenceReasonSubmit = ({ sessionId }: AbsenceReasonSubmitProps) => {
	return (
		<QueryErrorResetBoundary>
			<ErrorBoundary fallback={SessionDetailErrorFallback}>
				<Suspense fallback={<LoadingBox />}>
					<AbsenceReasonSubmitContainer sessionId={Number(sessionId)} />
				</Suspense>
			</ErrorBoundary>
		</QueryErrorResetBoundary>
	);
};

interface AbsenceReasonSubmitContainerProps {
	sessionId: number;
}

const AbsenceReasonSubmitContainer = ({ sessionId }: AbsenceReasonSubmitContainerProps) => {
	const [{ data: sessionDetail }, { data: myAbsenceReason }] = useSuspenseQueries({
		queries: [getSessionDetailQuery(sessionId), getMyAbsenceReasonOptions({ sessionId })],
	});

	const sessionDetailData = sessionDetail.data;
	const myAbsenceReasonData = myAbsenceReason.data;

	const session = {
		week: sessionDetailData.week,
		name: sessionDetailData.name,
		date: sessionDetailData.date,
		place: sessionDetailData.place,
	};

	return (
		// 제출 버튼을 위한 하단 여백
		<main className="pb-20">
			<SessionInfoCard {...session} />
			<Divider className="my-0.5 bg-line-normal" />
			<AbsenceSubmitForm defaultContents={myAbsenceReasonData?.contents} sessionId={sessionId} />
		</main>
	);
};

interface SessionInfoCardProps {
	week: number;
	name: string;
	date: string;
	place: string;
}

function SessionInfoCard({ week, name, date, place }: SessionInfoCardProps) {
	const rows = [
		{ label: '세션명', value: name },
		{ label: '세션 주차', value: `${week}주차` },
		{ label: '세션 날짜', value: formatISOStringToFullDateString(date) },
		{ label: '세션 장소', value: place ?? '-' },
	];

	return (
		<section className="flex flex-col gap-4 px-4 py-5">
			<p className="font-bold text-label-normal text-title1">결석 사유서 제출</p>
			<div className="flex flex-col gap-3 rounded-lg bg-background-subtle px-5 py-3 text-body2">
				{rows.map(({ label, value }) => (
					<div key={label} className="flex gap-4">
						<p className="w-17.5 shrink-0 font-semibold text-label-assistive">{label}</p>
						<p className="min-w-0 flex-1 font-medium text-label-subtle">{value}</p>
					</div>
				))}
			</div>
		</section>
	);
}

interface AbsenceSubmitFormProps {
	sessionId: number;
	defaultContents: string | undefined;
}

const MAX_CONTENTS_LENGTH = 50;
const FORM_ID = 'absence-submit-form';
const ABSENCE_TEXTAREA_LABEL = 'absence-textarea-label';

function AbsenceSubmitForm({ sessionId, defaultContents }: AbsenceSubmitFormProps) {
	const [contents, setContents] = useState(defaultContents ?? '');

	const router = useRouter();

	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		...submitAbsenceReasonOptions(sessionId),
		onSuccess: async () => {
			toast.success('결석 사유서를 제출했어요.');

			// 내 출석 상태 무효화를 마치고 홈으로 이동
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: getAttendanceMeBySessionIdOptions({ sessionId }).queryKey,
				}),
				queryClient.invalidateQueries({
					queryKey: getMyAbsenceReasonOptions({ sessionId }).queryKey,
				}),
			]);

			router.replace('/');
		},
		onError: async (error) => {
			if (error instanceof HTTPError) {
				try {
					const { message } = (await error.response.json()) as ApiErrorReponse;
					toast.error(message || '결석 사유서 제출에 실패했어요.');
				} catch {
					toast.error('운영진에게 문의해 주세요.');
				}
				return;
			}

			toast.error('네트워크 상태를 확인해 주세요.');
		},
	});

	const trimmedContents = contents.trim();
	const currentContentsLength = contents.length;

	const handleChangeContents = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = e.target;

		if (value.length > MAX_CONTENTS_LENGTH) {
			return;
		}

		setContents(value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (trimmedContents === '') {
			return;
		}

		mutate({ contents: trimmedContents });
	};

	const isInvalid = trimmedContents.length === 0;

	return (
		<section>
			<form id={FORM_ID} onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-5">
				<div className="flex items-center justify-between">
					<Label htmlFor={ABSENCE_TEXTAREA_LABEL} className="items-start gap-0.5">
						결석 사유
						<span aria-hidden="true" className="mt-0.5 size-1 rounded-full bg-red-400" />
					</Label>
					<p className="font-medium text-caption1 text-label-subtle">
						{currentContentsLength} / {MAX_CONTENTS_LENGTH}
					</p>
				</div>
				<Textarea
					id={ABSENCE_TEXTAREA_LABEL}
					value={contents}
					onChange={handleChangeContents}
					variant="line"
					required
					placeholder="ex) 아파서 병원다녀옴"
					minLength={0}
					maxLength={50}
				/>
			</form>
			<div className="fixed right-0 bottom-0 left-0 z-10 mx-auto max-w-lg bg-background-normal px-5 pt-3 pb-5">
				<Button
					type="submit"
					disabled={isInvalid}
					form={FORM_ID}
					variant="secondary"
					size="lg"
					className="w-full"
					loading={isPending}
				>
					제출하기
				</Button>
			</div>
		</section>
	);
}
