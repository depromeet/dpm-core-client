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
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { HTTPError } from 'ky';
import type { ApiErrorReponse, ImageResponse, Session } from '@dpm-core/api';
import { Button, Divider, Label, Textarea, toast } from '@dpm-core/shared';

import { LoadingBox } from '@/components/loading-box';
import { useImageUploads } from '@/hooks/use-image-uploads';
import { submitAbsenceReasonOptions } from '@/remotes/mutations/attendance';
import {
	getAttendanceMeBySessionIdOptions,
	getAttendanceMeOptions,
	getMyAbsenceReasonOptions,
} from '@/remotes/queries/attendance';
import { getSessionDetailQuery } from '@/remotes/queries/session';

import { AbsenceEvidenceField } from './absence-evidence-field';
import { SessionDetailErrorFallback } from './session-detail-error-fallback';

interface AbsenceReasonSubmitProps {
	sessionId: number;
}

export const AbsenceReasonSubmit = ({ sessionId }: AbsenceReasonSubmitProps) => {
	return (
		<QueryErrorResetBoundary>
			<ErrorBoundary fallback={SessionDetailErrorFallback}>
				<Suspense fallback={<LoadingBox />}>
					<AbsenceReasonSubmitContainer sessionId={sessionId} />
				</Suspense>
			</ErrorBoundary>
		</QueryErrorResetBoundary>
	);
};

const AbsenceReasonSubmitContainer = ({ sessionId }: AbsenceReasonSubmitProps) => {
	const [{ data: sessionDetail }, { data: myAbsenceReason }] = useSuspenseQueries({
		queries: [getSessionDetailQuery(sessionId), getMyAbsenceReasonOptions({ sessionId })],
	});

	const session = sessionDetail.data;
	const myAbsenceReasonData = myAbsenceReason.data;

	return (
		// 제출 버튼을 위한 하단 여백
		<main className="pb-24">
			<SessionInfoCard
				week={session.week}
				name={session.name}
				date={session.date}
				place={session.place}
				isOnline={session.isOnline}
			/>
			<Divider className="my-0.5 bg-line-normal" />
			<AbsenceSubmitForm
				key={sessionId}
				isEditing={myAbsenceReasonData != null}
				defaultContents={myAbsenceReasonData?.contents ?? ''}
				defaultImages={myAbsenceReasonData?.images ?? []}
				sessionId={sessionId}
			/>
		</main>
	);
};

type SessionInfoCardProps = Pick<Session, 'week' | 'name' | 'date' | 'place' | 'isOnline'>;

function SessionInfoCard({ week, name, date, place, isOnline }: SessionInfoCardProps) {
	const rows = [
		{ label: '세션명', value: name },
		{ label: '세션 주차', value: `${week}주차` },
		{
			label: '세션 날짜',
			value: dayjs(date).locale('ko').format('YY.MM.DD (ddd) HH:mm'),
		},
		{ label: '세션 장소', value: isOnline ? '온라인' : place },
	];

	return (
		<section className="flex flex-col gap-4 px-4 py-5">
			<p className="font-bold text-label-normal text-title1">결석 사유서 제출</p>
			<div className="flex flex-col gap-3 rounded-lg bg-background-subtle px-5 py-3 text-body2">
				{rows.map(({ label, value }) => (
					<div key={label} className="flex gap-4">
						<p className="w-17.5 shrink-0 font-medium text-label-assistive">{label}</p>
						<p className="min-w-0 flex-1 font-medium text-label-subtle">{value}</p>
					</div>
				))}
			</div>
		</section>
	);
}

interface AbsenceSubmitFormProps {
	isEditing: boolean;
	sessionId: number;
	defaultContents: string;
	defaultImages: ImageResponse[];
}

const MAX_CONTENTS_LENGTH = 50;
const FORM_ID = 'absence-submit-form';
const ABSENCE_TEXTAREA_LABEL = 'absence-textarea-label';

function AbsenceSubmitForm({
	isEditing,
	sessionId,
	defaultContents,
	defaultImages,
}: AbsenceSubmitFormProps) {
	const [contents, setContents] = useState(defaultContents);
	const { items, addFiles, remove, retry, imageIds, isReady } = useImageUploads(defaultImages);

	const router = useRouter();

	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		...submitAbsenceReasonOptions(),
		onSuccess: async () => {
			toast.success(isEditing ? '결석 사유서를 수정했어요.' : '결석 사유서를 제출했어요.');

			// 내 출석 상태 무효화를 마치고 홈으로 이동
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: getAttendanceMeOptions().queryKey }),
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
	const isInvalid = trimmedContents.length === 0 || !isReady || isPending;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isInvalid) {
			return;
		}

		mutate({ sessionId, contents: trimmedContents, imageIds });
	};

	return (
		<section>
			<form id={FORM_ID} onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-5">
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<Label htmlFor={ABSENCE_TEXTAREA_LABEL} className="items-start gap-0.5">
							결석 사유
							<span aria-hidden="true" className="mt-0.5 size-1 rounded-full bg-red-400" />
						</Label>
						<p className="font-medium text-caption1 text-label-subtle">
							{contents.length} / {MAX_CONTENTS_LENGTH}
						</p>
					</div>
					<Textarea
						id={ABSENCE_TEXTAREA_LABEL}
						value={contents}
						disabled={isPending}
						onChange={(event) => setContents(event.target.value)}
						variant="line"
						required
						placeholder="ex) 독감, 코딩테스트 등"
						maxLength={MAX_CONTENTS_LENGTH}
					/>
				</div>
				<AbsenceEvidenceField
					items={items}
					onAddFiles={addFiles}
					onRemove={remove}
					onRetry={retry}
					disabled={isPending}
				/>
			</form>
			<div className="fixed right-0 bottom-0 left-0 z-10 mx-auto max-w-lg bg-background-normal px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
				<Button
					type="submit"
					disabled={isInvalid}
					form={FORM_ID}
					variant="secondary"
					size="lg"
					className="w-full"
					loading={isPending}
				>
					{isEditing ? '수정 완료' : '제출하기'}
				</Button>
			</div>
		</section>
	);
}
