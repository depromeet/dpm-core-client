'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Form } from '@dpm-core/shared';

import { plusOneMinute } from '../../_utils';
import { FormAttendanceLateTime } from './form/FormAttendanceLateTime';
import { FormAttendancePresentTime } from './form/FormAttendancePresentTime';
import { FormDate } from './form/FormDate';
import { FormFeedbackSettings } from './form/FormFeedbackSettings';
import { FormName } from './form/FormName';
import { FormPlace } from './form/FormPlace';
import { FormWeek } from './form/FormWeek';

export const REGEXP_HHMM = /^([0-1][0-9]|2[0-3])[0-5][0-9]$/;

export const buildServerDatePayload = (formData: SessionSchema) => {
	const { name, sessionDate, isOnline, place, week, attendancePresentTime, attendanceLateTime } =
		formData;

	const baseDate = dayjs(sessionDate.date).format('YYYY-MM-DD');

	const combine = (time: string) =>
		dayjs(`${baseDate}T${time.slice(0, 2)}:${time.slice(2, 4)}`).format('YYYY-MM-DDTHH:mm:ss');

	const absentTimeStr = plusOneMinute(attendanceLateTime.end);
	const crossesMidnight = absentTimeStr < attendanceLateTime.end;
	const absentStart = crossesMidnight
		? dayjs(`${baseDate}T${absentTimeStr.slice(0, 2)}:${absentTimeStr.slice(2, 4)}`)
				.add(1, 'day')
				.format('YYYY-MM-DDTHH:mm:ss')
		: combine(absentTimeStr);

	return {
		name,
		date: combine(sessionDate.time),
		isOnline: isOnline === 'online',
		place,
		week: Number(week),
		attendanceStart: combine(attendancePresentTime.start),
		lateStart: combine(attendanceLateTime.start),
		absentStart,
	};
};

export const buildSessionPayload = (formData: SessionSchema) => {
	const payload = {
		...buildServerDatePayload(formData),
		feedbackEnabled: formData.feedbackEnabled,
		feedbackPushEnabled: formData.feedbackPushEnabled,
	};

	if (!formData.feedbackEnabled || !formData.feedbackStartAt.date) {
		return payload;
	}

	const date = dayjs(formData.feedbackStartAt.date).format('YYYY-MM-DD');
	const time = formData.feedbackStartAt.time;

	return {
		...payload,
		feedbackStartAt: dayjs(`${date}T${time.slice(0, 2)}:${time.slice(2, 4)}`).format(
			'YYYY-MM-DDTHH:mm:ss',
		),
	};
};

const createSessionSchema = (initialFeedbackStartAt?: string) =>
	z
		.object({
			cohortId: z.number(),
			name: z.string().min(1, '필수 입력 값입니다.'),
			sessionDate: z.object({
				date: z.date(),
				time: z.string().regex(REGEXP_HHMM, '필수 입력 값입니다.'),
			}),
			week: z
				.string()
				.min(1, '필수 입력 값입니다.')
				.regex(/^[1-9]\d*$/, '올바른 주차 형식이어야 합니다.'),
			isOnline: z.enum(['online', 'offline']),
			place: z.string(),
			attendancePresentTime: z.object({
				start: z.string().regex(REGEXP_HHMM, '필수 입력 값입니다.'),
				end: z.string().regex(REGEXP_HHMM, '필수 입력 값입니다.'),
			}),
			attendanceLateTime: z.object({
				start: z.string().regex(REGEXP_HHMM, '필수 입력 값입니다.'),
				end: z.string().regex(REGEXP_HHMM, '필수 입력 값입니다.'),
			}),
			feedbackEnabled: z.boolean(),
			feedbackPushEnabled: z.boolean(),
			feedbackStartAt: z.object({
				date: z.date().nullable(),
				time: z.string(),
			}),
		})
		.superRefine(
			(
				{
					isOnline,
					place,
					attendancePresentTime,
					attendanceLateTime,
					feedbackEnabled,
					feedbackStartAt,
				},
				ctx,
			) => {
				if (isOnline === 'offline' && place.trim().length <= 0) {
					ctx.addIssue({
						code: 'custom',
						path: ['place'],
						message: '필수 입력 값입니다.',
					});
				}

				const toMinutes = (value: string) => {
					if (value.length !== 4) return NaN;

					const h = Number(value.slice(0, 2));
					const m = Number(value.slice(2, 4));

					return h * 60 + m;
				};

				const presentStart = toMinutes(attendancePresentTime.start);
				const presentEnd = toMinutes(attendancePresentTime.end);
				const LateStart = toMinutes(attendanceLateTime.start);
				const LateEnd = toMinutes(attendanceLateTime.end);

				if (presentEnd <= presentStart) {
					ctx.addIssue({
						code: 'custom',
						path: ['attendancePresentTime.end'],
						message: '종료 시간은 시작 시간보다 이후여야합니다.',
					});
				}

				if (LateEnd <= LateStart) {
					ctx.addIssue({
						code: 'custom',
						path: ['attendanceLateTime.end'],
						message: '종료 시간은 시작 시간보다 이후여야합니다.',
					});
				}

				if (feedbackEnabled) {
					if (!feedbackStartAt.date) {
						ctx.addIssue({
							code: 'custom',
							path: ['feedbackStartAt.date'],
							message: '피드백 시작 시간을 입력해주세요.',
						});
					}

					if (!REGEXP_HHMM.test(feedbackStartAt.time)) {
						ctx.addIssue({
							code: 'custom',
							path: ['feedbackStartAt.time'],
							message: '피드백 시작 시간을 입력해주세요.',
						});
					}

					if (feedbackStartAt.date && REGEXP_HHMM.test(feedbackStartAt.time)) {
						const feedbackStartAtDate = dayjs(feedbackStartAt.date)
							.hour(Number(feedbackStartAt.time.slice(0, 2)))
							.minute(Number(feedbackStartAt.time.slice(2, 4)));

						const isUnchangedInitialStart =
							initialFeedbackStartAt &&
							feedbackStartAtDate.format('YYYY-MM-DDTHH:mm:ss') ===
								dayjs(initialFeedbackStartAt).format('YYYY-MM-DDTHH:mm:ss');

						if (!feedbackStartAtDate.isAfter(dayjs()) && !isUnchangedInitialStart) {
							ctx.addIssue({
								code: 'custom',
								path: ['feedbackStartAt.time'],
								message: '피드백 시작 시간은 현재 이후여야 합니다.',
							});
						}
					}
				}
			},
		);

export type SessionSchema = z.infer<ReturnType<typeof createSessionSchema>>;

export const FORM_ID = 'session-form';

export const SessionForm = ({
	defaultValues,
	showFeedbackSettings = false,
	feedbackStartAtInitialValue,
	onDirtyChange,
	onSubmit,
}: Readonly<{
	onSubmit: (formData: SessionSchema) => void;
	onDirtyChange?: (isDirty: boolean) => void;
	defaultValues?: Partial<SessionSchema>;
	showFeedbackSettings?: boolean;
	feedbackStartAtInitialValue?: string | null;
}>) => {
	const form = useForm<SessionSchema>({
		resolver: zodResolver(createSessionSchema(feedbackStartAtInitialValue ?? undefined)),
		defaultValues: {
			cohortId: 1,
			name: '',
			week: '',
			place: '',
			isOnline: 'online',
			feedbackEnabled: false,
			feedbackPushEnabled: true,
			...defaultValues,
			sessionDate: {
				date: defaultValues?.sessionDate?.date ?? new Date(),
				time: defaultValues?.sessionDate?.time ?? '',
			},
			attendancePresentTime: {
				start: defaultValues?.attendancePresentTime?.start ?? '',
				end: defaultValues?.attendancePresentTime?.end ?? '',
			},
			attendanceLateTime: {
				start: defaultValues?.attendanceLateTime?.start ?? '',
				end: defaultValues?.attendanceLateTime?.end ?? '',
			},
			feedbackStartAt: {
				date: defaultValues?.feedbackStartAt?.date ?? null,
				time: defaultValues?.feedbackStartAt?.time ?? '',
			},
		},
	});
	const { isDirty } = form.formState;

	useEffect(() => {
		onDirtyChange?.(isDirty);
	}, [isDirty, onDirtyChange]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} id={FORM_ID} className="flex flex-col gap-20">
				<section className="flex flex-col gap-10">
					<h3 className="font-semibold text-title2">세션 기본 정보</h3>
					<div className="flex flex-col gap-10">
						<FormName />
						<FormDate />
						<FormPlace />
						<FormWeek />
					</div>
				</section>
				<section className="flex flex-col gap-10">
					<h3 className="font-semibold text-title2">출결 시간 설정</h3>
					<div className="flex flex-col gap-10">
						<FormAttendancePresentTime />
						<FormAttendanceLateTime />
					</div>
				</section>
				{showFeedbackSettings && <FormFeedbackSettings />}
			</form>
		</Form>
	);
};
