'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Form } from '@dpm-core/shared';

import { plusOneMinute } from '../../_utils';
import { FormAttendanceLateTime } from './form/FormAttendanceLateTime';
import { FormAttendancePresentTime } from './form/FormAttendancePresentTime';
import { FormDate } from './form/FormDate';
import { FormName } from './form/FormName';
import { FormPlace } from './form/FormPlace';
import { FormWeek } from './form/FormWeek';

export const REGEXP_HHMM = /^([0-1][0-9]|2[0-3])[0-5][0-9]$/;

export const buildServerDatePayload = (formData: SessionSchema) => {
	const { name, sessionDate, isOnline, place, week, attendancePresentTime, attendanceLateTime } =
		formData;

	const baseDate = dayjs(sessionDate.date).format('YYYY-MM-DD');

	const combine = (time: string) => dayjs(`${baseDate}T${time}`).format('YYYY-MM-DDTHH:mm:ss');

	return {
		name,
		date: combine(sessionDate.time),
		isOnline: isOnline === 'online',
		place,
		week: Number(week),
		attendanceStart: combine(attendancePresentTime.start),
		lateStart: combine(attendanceLateTime.start),
		absentStart: combine(plusOneMinute(attendanceLateTime.end)),
	};
};

const sessionSchema = z
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
	})
	.superRefine(({ isOnline, place, attendancePresentTime, attendanceLateTime }, ctx) => {
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
	});

export type SessionSchema = z.infer<typeof sessionSchema>;

export const FORM_ID = 'session-form';

export const SessionForm = ({
	defaultValues = {
		cohortId: 1,
		name: '',
		week: '',
		sessionDate: {
			date: new Date(),
			time: '',
		},
		place: '',
		isOnline: 'online',
		attendancePresentTime: {
			start: '',
			end: '',
		},
		attendanceLateTime: {
			start: '',
			end: '',
		},
	},
	onSubmit,
}: Readonly<{
	onSubmit: (formData: SessionSchema) => void;
	defaultValues?: SessionSchema;
}>) => {
	const form = useForm<SessionSchema>({
		resolver: zodResolver(sessionSchema),
		defaultValues,
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} id={FORM_ID}>
				<div className="mb-10">
					<h3 className="mb-10 font-semibold text-title2">세션 기본 정보</h3>
					<div className="flex flex-col gap-10">
						<FormName />
						<FormDate />
						<FormPlace />
						<FormWeek />
					</div>
				</div>
				<div className="mt-10">
					<h3 className="mb-10 font-semibold text-title2">출결 시간 설정</h3>
					<div className="flex flex-col gap-10">
						<FormAttendancePresentTime />
						<FormAttendanceLateTime />
					</div>
				</div>
			</form>
		</Form>
	);
};
